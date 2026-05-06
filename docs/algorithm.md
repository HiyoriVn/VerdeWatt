# VerdeWatt Charging Algorithm (MVP)

## 1. Goal

The optimizer decides how much charging power to give each EV every hour so the building stays safe.

Main safety rule:

`base_load_kw + total_ev_charging_kw <= safe_capacity_kw`

This means EV charging should use only the spare electrical capacity left after normal building usage.

## 2. Input Files

The algorithm reads two files:

- `data/synthetic_building_load.csv`
  - Hourly building values (`hour`, `base_load_kw`, `safe_capacity_kw`, `unmanaged_ev_load_kw`)
- `data/ev_sessions_sample.json`
  - EV charging requests (`id`, `current_soc`, `target_soc`, `battery_kwh`, `deadline_hour`, `priority`, `max_charging_kw`)

## 3. Key Variables

- `base_load_kw`: Building electricity use (non-EV load) in a given hour.
- `safe_capacity_kw`: Maximum safe building load in that hour.
- `spare_capacity_kw`: Capacity available for EV charging in that hour.
  - Formula: `spare_capacity_kw = safe_capacity_kw - base_load_kw`
- `current_soc`: Current battery state of charge (%).
- `target_soc`: Desired battery state of charge (%).
- `battery_kwh`: Battery size in kWh.
- `deadline_hour`: Latest hour by which the EV wants charging (inclusive in this MVP).
- `priority`: Charging importance level (`urgent`, `normal`, `flexible`).

The algorithm also computes:

- `required_kwh = battery_kwh * (target_soc - current_soc) / 100`
- `remaining_kwh`: Energy still needed after each hour of charging.

## 4. Why We Do Not Use LSTM in the MVP

This MVP uses a rule-based method instead of LSTM (or any deep learning) for practical reasons:

- Faster to build during a hackathon.
- Easier to explain and debug for judges and teammates.
- No need for large historical datasets or model training.
- Behavior is predictable, which is useful for safety-focused systems.

For an MVP, clear and reliable logic is more important than advanced forecasting complexity.

## 5. Step-by-Step Algorithm

1. Load hourly building data and EV sessions from CSV/JSON.
2. For each EV, compute `required_kwh` and set `remaining_kwh = required_kwh`.
3. Process hours from `0` to `23`.
4. For each hour, compute:
   - `spare_capacity_kw = max(0, safe_capacity_kw - base_load_kw)`
5. Build a list of eligible EVs:
   - EV still needs energy (`remaining_kwh > 0`)
   - Current hour is not past deadline (`hour <= deadline_hour`)
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

This is called a greedy approach because it always gives available power first to the highest-priority and earliest-deadline EVs at each hour.

## 6. Output Metrics

The optimizer returns a dictionary with:

- `hourly_allocations`: List of charging decisions per hour and EV (`hour`, `ev_id`, `allocated_kw`).
- `total_load_after_optimization`: Hourly building load after controlled EV charging.
- `peak_before_kw`: Highest load in unmanaged scenario (`base_load_kw + unmanaged_ev_load_kw`).
- `peak_after_kw`: Highest load after optimization.
- `peak_reduction_kw`: `peak_before_kw - peak_after_kw`.
- `peak_reduction_percent`: Percentage peak reduction.
- `evs_fully_served`: EV IDs that reached full required energy.
- `evs_partially_served`: EV IDs that still have remaining energy demand.

## 7. Example With One EV Session

Example EV:

- `id`: `EV_001`
- `current_soc`: `22`
- `target_soc`: `80`
- `battery_kwh`: `60`
- `priority`: `urgent`
- `deadline_hour`: `7`
- `max_charging_kw`: `11`

Step 1: Compute required energy:

`required_kwh = 60 * (80 - 22) / 100 = 34.8 kWh`

Step 2: During each hour up to `07:00`, this EV can receive at most:

- `11 kW` (its charger limit)
- remaining energy it still needs
- remaining building spare capacity in that hour

So if there is enough spare capacity for several hours, `EV_001` will likely be fully served before its deadline. If spare capacity is tight, it may be only partially served, and that will appear in `evs_partially_served`.
