# VerdeWatt Impact Spec (MVP)

## Purpose

The Green Impact Estimator converts smart charging results into simple
environmental metrics that are easy to understand in a demo or proposal.

Endpoint:

- `GET /api/impact`

## Input Source

This module reuses billing output from `simulate_billing_kpis()`:

- `shifted_kwh`
- `estimated_saving_vnd`

## What `shifted_kwh` Means

`shifted_kwh` is the amount of EV charging energy moved away from peak-time
charging toward safer/lower-load periods.

In simple words:

- higher shifted kWh means more successful load shifting
- load shifting reduces stress on the grid and can lower emissions depending on energy mix

## Why Shifting Away from Peak Hours Matters

Shifting charging away from peak hours helps by:

- reducing overload risk in buildings
- improving grid stability during busy evening periods
- enabling cleaner and more efficient electricity usage patterns
- supporting cost savings for users and operators

## Constants Used (MVP Assumptions)

- `VIETNAM_GRID_EMISSION_FACTOR_KG_CO2_PER_KWH = 0.4715`
- `TREE_CO2_ABSORPTION_KG_PER_YEAR = 21.77`
- `PETROL_CO2_KG_PER_LITER = 2.31`

## Formulas

- `co2_saved_kg = shifted_kwh * VIETNAM_GRID_EMISSION_FACTOR_KG_CO2_PER_KWH`
- `trees_equivalent = co2_saved_kg / TREE_CO2_ABSORPTION_KG_PER_YEAR`
- `petrol_equivalent_liters = co2_saved_kg / PETROL_CO2_KG_PER_LITER`

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

## MVP Caveat (Important)

This impact result is a prototype estimate for hackathon communication.

Before final proposal submission or production use, all constants must be
verified and cited with official and up-to-date sources.
