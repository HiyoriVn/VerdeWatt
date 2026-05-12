# VerdeWatt Scheduler Spec (MVP)

## Purpose

Provide user-facing charging scheduling APIs for:

1. showing recommendation lists for existing sessions,
2. registering one user charging request and returning a recommendation.

This is rule-based simulation only (no real charger control).

## Endpoints

- `GET /api/schedule`
- `POST /api/charging-request`

## 1) GET /api/schedule

Returns schedule recommendations for existing EV sessions.

### Query Parameter

- `preference` (optional)
  - `cheapest`
  - `fastest`
  - `balanced` (default)

### Response Shape

Returns a list of objects with:

- `vehicle_id`
- `current_soc`
- `target_soc`
- `priority`
- `status`
- `recommended_action`
- `scheduled_start_hour`
- `estimated_completion_hour`
- `estimated_cost_vnd`
- `estimated_saving_vnd`
- `user_message`

## 2) POST /api/charging-request

Registers one user charging request and returns one recommendation.

### Request Body

```json
{
  "vehicle_id": "EV_123",
  "current_soc": 25,
  "target_soc": 80,
  "battery_kwh": 60,
  "deadline_hour": 7,
  "preference": "fastest"
}
```

### Response Body

```json
{
  "vehicle_id": "EV_123",
  "status": "scheduled_offpeak",
  "recommended_action": "Schedule for off-peak charging",
  "scheduled_start_hour": 23,
  "estimated_completion_hour": 6,
  "estimated_cost_vnd": 31000,
  "estimated_saving_vnd": 11000,
  "user_message": "Your vehicle is scheduled for off-peak charging to reduce cost and avoid building overload."
}
```

## Scheduling Rules

1. Urgent deadline or `fastest` preference -> earliest safe slot.
2. `cheapest` preference -> prefer off-peak around `23:00`.
3. `balanced` preference -> balance deadline reliability and off-peak cost.
4. Suspicious vehicles like `EV_999` -> `needs_attention`.
5. Cost uses current MVP tariff assumptions (`peak` vs `off-peak`).

## Cost Assumptions

- Peak tariff: `3500 VND/kWh` (hours `18-22`)
- Off-peak tariff: `1800 VND/kWh`

`estimated_saving_vnd` is compared against a simple peak-tariff baseline.

## Notes

- No login/auth.
- No database.
- No real payment.
- No full OCPP.
- No Docker.
- No WebSocket.
- No deep learning or heavy dependencies.
