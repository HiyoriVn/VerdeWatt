# VerdeWatt Billing and Impact KPI Spec (Simulation)

This module is simulation only. It does not process real payments.

## Endpoint

- `POST /api/billing`

## Purpose

Return billing and impact KPI values for dashboard cards, using:

- optimizer output (`hourly_allocations`) and
- simple tariff assumptions

## Request Options

### Option 1: No request body

Backend runs the optimizer internally and then computes billing KPIs.

### Option 2: Provide allocation data

You can pass custom allocation data:

```json
{
  "hourly_allocations": [
    { "hour": 0, "ev_id": "EV_001", "allocated_kw": 11.0 }
  ]
}
```

## Assumptions

- Peak tariff: `3500 VND/kWh`
- Off-peak tariff: `1800 VND/kWh`
- Incentive: `500 VND` per shifted kWh
- Peak hours: `18, 19, 20, 21, 22`

## KPI Definitions

- `total_kwh`: Total managed EV charging energy.
- `peak_kwh`: Managed EV charging energy during peak hours.
- `offpeak_kwh`: Managed EV charging energy outside peak hours.
- `shifted_kwh`: Peak energy avoided compared with unmanaged sample profile.
  - `shifted_kwh = unmanaged_peak_kwh - managed_peak_kwh` (minimum 0)
- `estimated_cost_vnd`: Simulated energy cost under managed charging.
  - `peak_kwh * 3500 + offpeak_kwh * 1800`
- `estimated_saving_vnd`: Tariff-based saving from shifted energy.
  - `shifted_kwh * (3500 - 1800)`
- `incentive_value_vnd`: Incentive value for shifted energy.
  - `shifted_kwh * 500`

## Response Shape

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
  },
  "optimizer_summary": {
    "peak_before_kw": 154.0,
    "peak_after_kw": 120.0,
    "peak_reduction_kw": 34.0,
    "peak_reduction_percent": 22.08
  }
}
```

## Notes

- Values are estimates for demo and KPI simulation only.
- No real payment, wallet, or billing settlement is included in this MVP.
