# VerdeWatt Vehicle Lookup Spec (MVP)

## Endpoint

- `GET /api/vehicle/{vehicle_id}`

## Purpose

Look up one EV by vehicle code and return its latest charging recommendation.

This endpoint is useful for:

- user status lookup after submitting `POST /api/charging-request`
- vehicle lookup search box
- driver-facing status panel
- quick support/operator checks

## Data Source

The route uses `backend/app/services/vehicle_service.py`, which reads the
current recommendation list from `GET /api/schedule` logic.

## Matching Rule

- Vehicle ID search is **case-insensitive**.
- Example: `ev_001`, `EV_001`, and `Ev_001` all match the same vehicle.

## Success Response (200)

Returns one vehicle recommendation object.

Fields include:

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

Example:

```json
{
  "vehicle_id": "EV_001",
  "current_soc": 22.0,
  "target_soc": 80.0,
  "priority": "urgent",
  "status": "charging_now",
  "recommended_action": "Charge now in the earliest safe slot to protect deadline reliability.",
  "scheduled_start_hour": 0,
  "estimated_completion_hour": 7,
  "estimated_cost_vnd": 42000.0,
  "estimated_saving_vnd": 0.0,
  "user_message": "Your vehicle is prioritized because it is urgent and must be ready by 07:00."
}
```

## Not Found Response (404)

If vehicle code does not exist:

```json
{
  "detail": "Vehicle code not found"
}
```

## Notes

- Endpoint is read-only and case-insensitive.
- Returns HTTP 404 with `{ "detail": "Vehicle code not found" }` when missing.
- MVP simulation only (no login/auth, database, real payment, full OCPP, Docker, or heavy dependencies).
