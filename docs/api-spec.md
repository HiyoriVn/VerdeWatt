# VerdeWatt API Spec v1

## Base URLs

- Base URL: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

## Backend Organization Note

Internal route modules are organized under:

```text
backend/app/api/routes/
```

and aggregated through:

```text
backend/app/api/router.py
```

API endpoint paths remain unchanged.

## MVP Constraints

This API spec is for the hackathon MVP only.

The MVP does **not** include:

- authentication
- real payment integration
- database requirement
- full OCPP implementation
- real EV charger / IoT hardware integration
- LSTM or deep learning forecasting

The backend uses synthetic CSV/JSON data and rule-based services for a stable hackathon demo.

## Frontend Environment

Frontend should read the backend base URL from:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If the environment variable is missing, frontend should fallback to:

```text
http://127.0.0.1:8000
```

## Endpoint Summary

| Method | Endpoint        | Purpose                               | Frontend component        |
| ------ | --------------- | ------------------------------------- | ------------------------- |
| GET    | `/health`       | Check server status                   | Dev check / startup check |
| GET    | `/api/load`     | Get building load curve data          | `LoadCurveChart`          |
| GET    | `/api/sessions` | Get EV charging sessions              | `EVSessionCard`           |
| POST   | `/api/allocate` | Run smart charging allocation         | `AllocationSummary`       |
| GET    | `/api/allocate` | Browser helper for allocation testing | Manual test / dev helper  |
| GET    | `/api/alerts`   | Get rule-based security alerts        | `SecurityAlertFeed`       |
| POST   | `/api/billing`  | Get billing + impact KPI simulation   | `KPICards`                |
| GET    | `/api/schedule` | Return charging recommendations for existing EV sessions | Charging Sessions page / building manager overview |
| GET    | `/api/vehicle/{vehicle_id}` | Check one vehicle charging status by code | Resident vehicle status check |
| POST   | `/api/charging-request` | Submit one charging request and get recommendation | Resident charging request form |
| GET    | `/api/charger-commands` | Get OCPP-compatible mock charger commands | Charger control demo panel |
| GET    | `/api/forecast` | Get next-6-hour base load forecast | Forecast widget (optional) |
| GET    | `/api/impact` | Get environmental impact estimate from shifted energy | Impact KPI card (optional) |

---

# 1. `GET /health`

## Purpose

Quickly confirm the backend is running.

## Frontend Component

* Dev check before loading dashboard data

## Request Body

None.

## Example Response

```json
{
  "status": "ok"
}
```

## Important Fields

* `status`: should be `"ok"` when the server is healthy.

---

# 2. `GET /api/load`

## Purpose

Return 24-hour building load data, including base building load, safe capacity, and unmanaged EV charging demand.

This endpoint is used to show why the building may exceed safe capacity during evening peak hours if EV charging is not managed.

## Frontend Component

* `LoadCurveChart`

## Request Body

None.

## Example Response

```json
[
  {
    "hour": 18,
    "base_load_kw": 88.0,
    "safe_capacity_kw": 120.0,
    "unmanaged_ev_load_kw": 42.0
  },
  {
    "hour": 19,
    "base_load_kw": 94.0,
    "safe_capacity_kw": 120.0,
    "unmanaged_ev_load_kw": 50.0
  }
]
```

## Important Fields

* `hour`: hour index from `0` to `23`.
* `base_load_kw`: normal building electricity demand.
* `safe_capacity_kw`: maximum safe load limit for the building.
* `unmanaged_ev_load_kw`: EV charging demand if all vehicles charge without smart control.

## Frontend Usage Notes

Frontend can calculate unmanaged total load as:

```text
unmanaged_total_load_kw = base_load_kw + unmanaged_ev_load_kw
```

The `safe_capacity_kw` field should be displayed as a red safety line on the chart.

---

# 3. `GET /api/sessions`

## Purpose

Return the EV charging session list used by the optimizer and UI.

Each session represents one EV that needs charging.

## Frontend Component

* `EVSessionCard`

## Request Body

None.

## Example Response

```json
[
  {
    "id": "EV_001",
    "current_soc": 22,
    "target_soc": 80,
    "battery_kwh": 60,
    "deadline_hour": 7,
    "priority": "urgent",
    "max_charging_kw": 11
  }
]
```

## Important Fields

* `id`: EV/session identifier.
* `current_soc`: current battery percentage.
* `target_soc`: target battery percentage.
* `battery_kwh`: battery size in kWh.
* `deadline_hour`: desired completion hour.
* `priority`: charging priority.
* `max_charging_kw`: maximum allowed charging power for that EV.

## Allowed Priority Values

```text
urgent
normal
flexible
```

## Frontend Usage Notes

Suggested UI display:

* EV ID
* current SOC → target SOC
* deadline
* priority badge
* max charging power

---

# 4. `POST /api/allocate`

## Purpose

Run the rule-based optimizer and return the full smart charging allocation result.

This endpoint demonstrates the core VerdeWatt value:

> Without VerdeWatt, unmanaged EV charging may exceed safe building capacity.
> With VerdeWatt, charging power is dynamically allocated so total load stays under the safe limit.

## Frontend Component

* `AllocationSummary`

## Request Body

None in the MVP.

Frontend may call this endpoint with an empty JSON object:

```json
{}
```

## Example Response

```json
{
  "hourly_allocations": [
    {
      "hour": 0,
      "ev_id": "EV_001",
      "allocated_kw": 11.0
    }
  ],
  "total_load_after_optimization": [
    {
      "hour": 0,
      "total_load_kw": 61.0
    }
  ],
  "peak_before_kw": 154.0,
  "peak_after_kw": 120.0,
  "peak_reduction_kw": 34.0,
  "peak_reduction_percent": 22.08,
  "evs_fully_served": ["EV_001", "EV_003"],
  "evs_partially_served": ["EV_999"],
  "peak_after_under_safe_capacity_kw": 0.0
}
```

## Important Fields

* `hourly_allocations`: per-hour EV charging decisions.
* `total_load_after_optimization`: total building load after smart allocation.
* `peak_before_kw`: unmanaged peak load.
* `peak_after_kw`: optimized peak load.
* `peak_reduction_kw`: peak reduction in kW.
* `peak_reduction_percent`: peak reduction percentage.
* `evs_fully_served`: EV IDs that received all required energy.
* `evs_partially_served`: EV IDs that still need energy after scheduling.
* `peak_after_under_safe_capacity_kw`: safety margin at the optimized peak hour.

## Safety Margin Meaning

`peak_after_under_safe_capacity_kw` means:

```text
safe_capacity_kw - peak_after_kw
```

Interpretation:

* Positive value: optimized load is below safe capacity.
* Zero: optimized load is exactly at safe capacity.
* Negative value: optimized load is still above safe capacity.

## Frontend Usage Notes

Frontend should use this endpoint for:

* before/after peak comparison
* allocation chart
* safety compliance KPI
* EV served status

Suggested KPI cards:

* Peak Before
* Peak After
* Peak Reduction
* Safety Margin

---

# 5. `GET /api/allocate`

## Purpose

Helper route for quick browser/manual testing.

It returns the same payload as `POST /api/allocate` in the MVP.

## Frontend Component

* Manual test / dev helper only

## Request Body

None.

## Example Response

Same as `POST /api/allocate`.

## Important Notes

This endpoint exists for convenience during development. The main dashboard should use `POST /api/allocate`.

---

# 6. `GET /api/alerts`

## Purpose

Return sample rule-based security alerts.

This endpoint demonstrates the cybersecurity layer of VerdeWatt.

Example alert types:

* abnormal power request
* repeated or suspicious charging session
* offline charger / DoS-like behavior

## Frontend Component

* `SecurityAlertFeed`

## Request Body

None.

## Example Response

```json
[
  {
    "id": "ALERT-PWR-EV_999",
    "timestamp": "2026-05-07T06:00:00+00:00",
    "severity": "High",
    "title": "Abnormal power request",
    "message": "Session EV_999 requested 120.0 kW, which is above the safe threshold of 22.0 kW.",
    "suggested_action": "Cap charging power to a safe value and verify charger/session settings.",
    "related_session_id": "EV_999",
    "related_charger_id": null
  }
]
```

## Important Fields

* `id`: alert identifier.
* `timestamp`: time when alert was generated.
* `severity`: alert severity.
* `title`: short alert title.
* `message`: detailed explanation.
* `suggested_action`: recommended operator action.
* `related_session_id`: EV session related to the alert, if any.
* `related_charger_id`: charger related to the alert, if any.

## Severity Values

```text
Low
Medium
High
```

## Frontend Usage Notes

Suggested UI display:

* severity badge
* title
* message
* suggested action
* related EV/session/charger ID

---

# 7. `POST /api/billing`

## Purpose

Return simulated billing and impact KPIs for dashboard cards.

This is **not** real payment processing. It is only a financial simulation for the hackathon MVP.

## Frontend Component

* `KPICards`

## Request Body

Two supported options:

### Option 1: Empty JSON object

Backend runs the optimizer internally.

```json
{}
```

### Option 2: Custom allocation data

Frontend may send allocation data if it already has optimizer output.

```json
{
  "hourly_allocations": [
    {
      "hour": 0,
      "ev_id": "EV_001",
      "allocated_kw": 11.0
    }
  ]
}
```

## Example Response

```json
{
  "total_kwh": 220.5,
  "peak_kwh": 40.0,
  "offpeak_kwh": 180.5,
  "shifted_kwh": 204.0,
  "estimated_cost_vnd": 464900.0,
  "estimated_saving_vnd": 346800.0,
  "incentive_value_vnd": 102000.0,
  "assumptions": {
    "peak_tariff_vnd_per_kwh": 3500,
    "offpeak_tariff_vnd_per_kwh": 1800,
    "incentive_vnd_per_shifted_kwh": 500,
    "peak_hours": [18, 19, 20, 21, 22]
  }
}
```

## Important Fields

* `total_kwh`: total managed EV charging energy.
* `peak_kwh`: energy charged during peak tariff hours.
* `offpeak_kwh`: energy charged during off-peak hours.
* `shifted_kwh`: charging moved away from peak period.
* `estimated_cost_vnd`: estimated managed charging cost.
* `estimated_saving_vnd`: estimated savings from shifting.
* `incentive_value_vnd`: simulated incentive amount.
* `assumptions`: tariff and incentive assumptions used in calculation.

## Billing Assumptions

Default MVP assumptions:

```text
Peak tariff: 3500 VND/kWh
Off-peak tariff: 1800 VND/kWh
Incentive: 500 VND per shifted kWh
Peak hours: 18, 19, 20, 21, 22
```

## Frontend Usage Notes

Suggested KPI cards:

* Total kWh
* Shifted kWh
* Estimated Saving
* Incentive Value

---

# 8. `GET /api/schedule`

## Purpose

Return charging recommendations for existing EV sessions.

## Frontend Component

* Charging Sessions page
* Building manager schedule overview

## Request Body

None.

## Query Parameter

`preference` (optional):

- `fastest`
- `cheapest`
- `balanced` (default)

## Example Response

```json
[
  {
    "vehicle_id": "EV_001",
    "current_soc": 22,
    "target_soc": 80,
    "priority": "urgent",
    "status": "charging_now",
    "recommended_action": "Charge now",
    "scheduled_start_hour": 19,
    "estimated_completion_hour": 7,
    "estimated_cost_vnd": 42000,
    "estimated_saving_vnd": 0,
    "user_message": "Your vehicle is prioritized because it must be ready by 07:00."
  }
]
```

## Important Fields

* `status` can be values like `charging_now`, `scheduled_offpeak`, `delayed_for_safety`, `completed`, or `needs_attention`.
* `recommended_action` and `user_message` are beginner-friendly strings for frontend display.
* `estimated_cost_vnd` and `estimated_saving_vnd` are simulation estimates for MVP.

## Error Behavior

* Unsupported `preference` values are handled as `balanced` mode in MVP.
* Standard API failures return:

```json
{ "detail": "Readable error message" }
```

---

# 9. `GET /api/vehicle/{vehicle_id}`

## Purpose

Allow residents to check charging status by vehicle code without login.

## Frontend Component

* Resident vehicle lookup page
* Driver status card

## Request Body

None.

Path parameter:

* `vehicle_id` (case-insensitive)

## Example Request

`GET /api/vehicle/EV_001`

## Example Success Response (200)

```json
{
  "vehicle_id": "EV_001",
  "current_soc": 22,
  "target_soc": 80,
  "priority": "urgent",
  "status": "charging_now",
  "recommended_action": "Charge now",
  "estimated_completion_hour": 7,
  "estimated_cost_vnd": 42000,
  "estimated_saving_vnd": 0,
  "user_message": "Your vehicle is prioritized because it must be ready by 07:00."
}
```

## Example 404 Response

```json
{
  "detail": "Vehicle code not found"
}
```

---

# 10. `POST /api/charging-request`

## Purpose

Allow a resident to submit a charging request and receive a smart charging recommendation.

## Frontend Component

* Resident charging request form
* Request confirmation panel

## Request Body

```json
{
  "vehicle_id": "EV_TEST_01",
  "current_soc": 25,
  "target_soc": 80,
  "battery_kwh": 60,
  "deadline_hour": 7,
  "preference": "cheapest"
}
```

Allowed `preference` values:

- `fastest`
- `cheapest`
- `balanced`

## Example Response

```json
{
  "vehicle_id": "EV_TEST_01",
  "status": "scheduled_offpeak",
  "recommended_action": "Schedule for off-peak charging",
  "scheduled_start_hour": 23,
  "estimated_completion_hour": 6,
  "estimated_cost_vnd": 31000,
  "estimated_saving_vnd": 11000,
  "user_message": "Your vehicle is scheduled for off-peak charging to reduce cost and avoid building overload."
}
```

## Notes

* This endpoint is simulation-only for MVP.
* It does not create login accounts or persistent database records.

---

# 11. `GET /api/charger-commands`

## Purpose

Return OCPP-compatible **mock** charger control commands based on:

* scheduler recommendations
* security alerts
* suspicious sessions such as `EV_999`

## Frontend Component

* Charger command monitor panel
* Operator demo console

## Request Body

None.

Optional query parameter:

```text
preference=balanced|fastest|cheapest
```

## Example Response

```json
[
  {
    "charger_id": "CHG_01",
    "related_ev_id": "EV_001",
    "command": "SetChargingProfile",
    "max_current_amp": 16,
    "reason": "Building load near safe capacity"
  },
  {
    "charger_id": "CHG_09",
    "related_ev_id": "EV_999",
    "command": "RemoteStopTransaction",
    "reason": "Abnormal power request detected"
  }
]
```

## Important Fields

* `charger_id`: mock charger identifier.
* `related_ev_id`: related vehicle ID, if applicable.
* `command`: mock command name (`SetChargingProfile`, `RemoteStopTransaction`, `ExcludeFromAllocation`, `InspectCharger`, `RequireSessionReview`).
* `max_current_amp`: current cap for profile-based commands.
* `reason`: explanation for why this command was generated.

## Error Behavior

* Standard API failures return:

```json
{ "detail": "Readable error message" }
```

---

# 12. `GET /api/forecast`

## Purpose

Return a lightweight 6-hour forecast for `base_load_kw` using a
`RandomForestRegressor` model trained on augmented synthetic data.

## Frontend Component

* Forecast widget or operations panel (optional in current dashboard)

## Request Body

None.

## Example Response

```json
{
  "model": "RandomForestRegressor",
  "forecast_horizon_hours": 6,
  "predictions": [
    {
      "hour": 18,
      "predicted_base_load_kw": 92.5,
      "is_peak_hour": true
    }
  ],
  "feature_importance": [
    {
      "feature": "hour",
      "importance": 0.31
    }
  ],
  "note": "MVP forecast trained on augmented synthetic data for prototype demonstration."
}
```

## Important Fields

* `model`: model family used by the endpoint.
* `forecast_horizon_hours`: number of future hours predicted.
* `predictions`: list of forecast rows.
* `feature_importance`: simple model interpretability output.
* `note`: MVP scope explanation for hackathon context.

## Error Behavior

If `scikit-learn` is not installed:

* HTTP `503`
* Response:

```json
{
  "detail": "scikit-learn is required for forecasting. Install with: pip install -r backend/requirements.txt"
}
```

---

# 13. `GET /api/impact`

## Purpose

Convert shifted charging energy into simple environmental indicators
(`co2_saved_kg`, `trees_equivalent`, `petrol_equivalent_liters`).

## Frontend Component

* Impact KPI cards (optional in current dashboard)

## Request Body

None.

## Example Response

```json
{
  "shifted_kwh": 204.0,
  "estimated_saving_vnd": 346800.0,
  "co2_saved_kg": 96.19,
  "trees_equivalent": 4.42,
  "petrol_equivalent_liters": 41.64,
  "assumptions": {
    "grid_emission_factor_kg_co2_per_kwh": 0.4715,
    "tree_absorption_kg_co2_per_year": 21.77,
    "petrol_kg_co2_per_liter": 2.31
  },
  "note": "Prototype impact estimate. Final emission factors should be verified with official sources before submission."
}
```

## Important Fields

* `shifted_kwh`: EV energy moved away from peak charging periods.
* `co2_saved_kg`: estimated CO2 reduction from shifted energy.
* `trees_equivalent`: simple tree-equivalent communication metric.
* `petrol_equivalent_liters`: equivalent liters of petrol emissions.
* `assumptions`: constants used for conversion.

## Error Behavior

Standard API failures return:

```json
{ "detail": "Readable error message" }
```

---

# Error Response Convention

For the MVP, API errors should return a simple JSON shape:

```json
{
  "detail": "Readable error message"
}
```

Frontend should show a friendly fallback message if an API call fails.

Suggested fallback message:

```text
Unable to load VerdeWatt data. Please check that the FastAPI backend is running at http://127.0.0.1:8000.
```

---

# Frontend Integration Checklist

Before considering the frontend API integration done, check:

* `LoadCurveChart` can load data from `GET /api/load`.
* `EVSessionCard` can load data from `GET /api/sessions`.
* `AllocationSummary` can run `POST /api/allocate`.
* `SecurityAlertFeed` can load data from `GET /api/alerts`.
* `KPICards` can load data from `POST /api/billing`.
* Schedule UI can load data from `GET /api/schedule`.
* Vehicle lookup can load data from `GET /api/vehicle/{vehicle_id}`.
* Charging request form can call `POST /api/charging-request`.
* Charger command panel can load data from `GET /api/charger-commands`.
* Forecast widget can load data from `GET /api/forecast` (optional).
* Impact widget can load data from `GET /api/impact` (optional).
* If one API fails, the UI shows a friendly fallback message.
* No frontend component assumes authentication.
* No frontend component assumes real payment.
* No frontend component requires a database.

---

# Manual Test Order

Recommended test order in Swagger docs:

```text
1. GET /health
2. GET /api/load
3. GET /api/sessions
4. POST /api/allocate
5. GET /api/alerts
6. POST /api/billing
7. GET /api/schedule
8. GET /api/vehicle/EV_001
9. POST /api/charging-request
10. GET /api/charger-commands
11. GET /api/forecast
12. GET /api/impact
```

If all endpoints return valid JSON, the backend is ready for frontend integration.
