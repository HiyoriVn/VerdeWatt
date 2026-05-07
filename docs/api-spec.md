# VerdeWatt API Spec

## `POST /api/allocate`

Run the rule-based optimizer and return the full optimization result.

This endpoint does not require a request body in the MVP.

### Response (JSON)

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

### Field Notes

- `peak_before_kw`: Maximum unmanaged load (`base_load_kw + unmanaged_ev_load_kw`).
- `peak_after_kw`: Maximum load after optimization.
- `peak_reduction_kw`: `peak_before_kw - peak_after_kw`.
- `peak_reduction_percent`: Percent reduction compared with unmanaged peak.
- `evs_fully_served`: EV IDs that received all required energy.
- `evs_partially_served`: EV IDs that still need energy after scheduling.
- `peak_after_under_safe_capacity_kw`: Safety margin at the optimized peak hour.
  - Positive: below safe capacity
  - Zero: exactly at safe capacity
  - Negative: above safe capacity
- `hourly_allocations`: Per-hour charging decisions when available.

## `GET /api/allocate` (helper route)

Returns the same payload as `POST /api/allocate` for quick browser/manual testing.
