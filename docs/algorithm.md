# VerdeWatt Charging Algorithm (MVP)

## 1. What problem the optimizer solves

The optimizer decides how much charging power to give each EV every hour so the
building stays within its safe electrical capacity while still serving EVs by
priority and deadline.

Safety rule:

`base_load_kw + total_ev_charging_kw <= safe_capacity_kw`

In other words, EV charging should only use the spare capacity left after
normal building usage.

## 2. Input files used

The algorithm reads two files:

- `data/synthetic_building_load.csv`
  - Hourly building values (`hour`, `base_load_kw`, `safe_capacity_kw`, `unmanaged_ev_load_kw`)
- `data/ev_sessions_sample.json`
  - EV charging requests (`id`, `current_soc`, `target_soc`, `battery_kwh`, `deadline_hour`, `priority`, `max_charging_kw`)

## 3. Key variables

- `base_load_kw`: Building electricity use (non-EV load) in a given hour.
- `safe_capacity_kw`: Maximum safe building load in that hour.
- `unmanaged_ev_load_kw`: EV load if everyone charged without control.
- `spare_capacity_kw`: Capacity available for EV charging in that hour.
  - Formula: `spare_capacity_kw = safe_capacity_kw - base_load_kw`
- `current_soc`: Current battery state of charge (%).
- `target_soc`: Desired battery state of charge (%).
- `battery_kwh`: Battery size in kWh.
- `deadline_hour`: Latest hour by which the EV wants charging (inclusive in this MVP).
- `priority`: Charging importance level (`urgent`, `normal`, `flexible`).
- `max_charging_kw`: Maximum charging power allowed for that EV.

The optimizer also computes:

- `required_kwh = battery_kwh * (target_soc - current_soc) / 100`
- `remaining_kwh`: Energy still needed after each hour of charging.

## 4. Step-by-step algorithm

1. Load hourly building data and EV sessions from CSV/JSON.
2. For each EV, compute `required_kwh` and set `remaining_kwh = required_kwh`.
3. Process hours in order (0 to 23).
4. For each hour, compute spare capacity:
   - `spare_capacity_kw = max(0, safe_capacity_kw - base_load_kw)`
5. Build a list of eligible EVs:
   - EV still needs energy (`remaining_kwh > 0`)
   - Current hour is not past the EV deadline (`hour <= deadline_hour`)
6. Sort eligible EVs using a greedy priority queue:
   - First by `priority` (`urgent` before `normal` before `flexible`)
   - Then by earliest `deadline_hour`
7. Allocate power EV by EV:
   - `allocation_kw = min(max_charging_kw, remaining_kwh, remaining_capacity_kw)`
   - Subtract this allocation from both `remaining_kwh` and hourly remaining capacity
   - Record `{hour, ev_id, allocated_kw}`
8. Compute optimized total load for that hour:
   - `total_load_kw = base_load_kw + total_allocated_kw_this_hour`
9. After all hours, calculate peak and service metrics.

This is called a greedy approach because it always gives available power first
to the highest-priority and earliest-deadline EVs at each hour.

## 5. Why the MVP optimizer does not use LSTM

The charging optimizer itself is fully rule-based. It does not use deep
learning or black-box scheduling.

Reasons:

- **Explainability:** building operators can understand why each EV was chosen.
- **Reliability:** deterministic rules are easier to debug during a hackathon.
- **Data limits:** LSTM models usually need larger historical datasets.
- **Scope control:** the MVP focuses on safe allocation first, then optional
  forecasting improvements in a separate module.

## 6. Output metrics

The optimizer returns these metrics:

- `peak_before_kw`: Highest unmanaged load (`base_load_kw + unmanaged_ev_load_kw`).
- `peak_after_kw`: Highest load after optimization.
- `peak_reduction_kw`: `peak_before_kw - peak_after_kw`.
- `peak_reduction_percent`: Percentage peak reduction.
- `evs_fully_served`: EV IDs that reached full required energy.
- `evs_partially_served`: EV IDs that still have remaining energy demand.
- `peak_after_under_safe_capacity_kw`: numeric safety margin at the optimized
  peak hour.
  - Formula: `safe_capacity_at_peak_after_hour - peak_after_kw`
  - Positive: still below safe limit
  - Zero: exactly at safe limit
  - Negative: above safe limit
- `peak_after_is_safe`: boolean safety flag (`true` when margin is non-negative).

## 7. How to run

From the project root:

```bash
python ai/optimizer.py
```

## 8. How to interpret the CLI output

The CLI prints a validation summary with these fields:

- `peak_before_kw`: The worst-case load if EVs charge without control.
- `peak_after_kw`: The highest load after optimization.
- `peak_reduction_kw`: How many kW were reduced at the peak.
- `peak_reduction_percent`: Percent reduction at the peak.
- `evs_fully_served`: EV IDs that finished charging.
- `evs_partially_served`: EV IDs that still need energy.
- `peak_after_under_safe_capacity_kw`: numeric safety margin in kW at the
  optimized peak hour.
- `peak_after_is_safe`: quick yes/no safety flag based on that margin.
