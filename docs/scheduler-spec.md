# VerdeWatt Scheduler Spec (MVP)

## Purpose

The scheduler turns optimizer output into practical per-vehicle recommendations.
It is designed for:

- Vehicle Lookup views
- Dashboard recommendation cards

This is rule-based simulation only (no real charger control).

## Endpoint

- `GET /api/schedule`

## Query Parameter

- `preference` (optional)
  - `cheapest`: prefers lower-cost off-peak charging when possible
  - `fastest`: prefers earliest safe slot
  - `balanced` (default): balances deadline urgency and cost

If an unsupported value is provided, scheduler falls back to `balanced`.

## Data Inputs

Scheduler uses:

1. `data/ev_sessions_sample.json`
2. optimizer result from `ai/optimizer.py` via `run_optimizer()`

## Output

Returns a list of recommendation objects.

Each object includes:

- `vehicle_id`
- `status`: `charging_now` / `scheduled_offpeak` / `delayed_for_safety` / `completed` / `needs_attention`
- `recommended_action`
- `scheduled_start_hour`
- `estimated_completion_hour`
- `estimated_cost_vnd`
- `estimated_saving_vnd`
- `user_message`

## Core Rules

1. **Urgent vehicles first**
   - Urgent EVs prefer earlier safe slots.
2. **Flexible vehicles off-peak**
   - Flexible EVs are shifted to off-peak where possible.
3. **Suspicious vehicles**
   - Sessions like `EV_999` are marked `needs_attention`.
4. **Preference modes**
   - `cheapest`: prioritize off-peak tariff slots
   - `fastest`: prioritize earliest safe slot
   - `balanced`: urgent early, flexible off-peak if possible

## Cost Assumptions

Simple simulation tariffs:

- Peak tariff: `3500 VND/kWh` (hours 18-22)
- Off-peak tariff: `1800 VND/kWh`

Per-EV cost and savings are estimates:

- `estimated_cost_vnd`: based on allocated charging hours and tariffs
- `estimated_saving_vnd`: compared against a simple peak-tariff baseline

## Example Response

```json
[
  {
    "vehicle_id": "EV_001",
    "status": "charging_now",
    "recommended_action": "Charge now in the earliest safe slot to protect deadline reliability.",
    "scheduled_start_hour": 0,
    "estimated_completion_hour": 3,
    "estimated_cost_vnd": 62640.0,
    "estimated_saving_vnd": 59160.0,
    "user_message": "Charging can start now while staying under safe building capacity."
  },
  {
    "vehicle_id": "EV_999",
    "status": "needs_attention",
    "recommended_action": "Pause auto-charging and verify this session manually before continuing.",
    "scheduled_start_hour": null,
    "estimated_completion_hour": null,
    "estimated_cost_vnd": 0.0,
    "estimated_saving_vnd": 0.0,
    "user_message": "This vehicle has suspicious behavior and needs manual review for safety."
  }
]
```

## Notes

- This endpoint is for recommendation simulation in MVP UI.
- No auth, real payment, database, Docker, LSTM, or full OCPP integration is included.
