# VerdeWatt API Spec v1

## Base URLs

- Base URL: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

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
```

If all endpoints return valid JSON, the backend is ready for frontend integration.

```