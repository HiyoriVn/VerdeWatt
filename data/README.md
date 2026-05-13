# VerdeWatt Data Scenario (MVP)

## Purpose

This folder contains synthetic MVP data for a representative apartment or residential charging area scenario.

- It is designed for demo and proposal explanation.
- It is not an official benchmark for all Vietnamese or ASEAN buildings.
- It does not claim any charger count or vehicle mix as official.

## Files

- `synthetic_building_load.csv`: 24-hour synthetic building load profile.
- `ev_sessions_sample.json`: mixed electric motorbike and EV car charging sessions.
- `chargers_sample.json`: charger inventory for the scenario.
- `scenario_metadata.json`: high-level assumptions, counts, and disclaimer metadata.

## Scenario Scope

- The scenario models mixed electric motorbikes and EV cars in one residential site.
- Charger quantity and type distribution are demo assumptions only.
- These values are selected for explainable MVP behavior, not population-level reporting.

## Policy Context Note

- Cong dien 27/CD-TTg is included as policy context only.
- Do not present it as mandating specific charger numbers or detailed technical requirements unless verified sources are added.

## Vehicle and Charger Assumptions

- `electric_motorbike` sessions use battery values around `2` to `5` kWh and charging limits around `0.8` to `1.5` kW.
- `small_ev_car` sessions use battery values around `30` to `45` kWh with `7` kW charging limits.
- `standard_ev_car` sessions use battery values around `50` to `75` kWh with `7` or `11` kW charging limits.
- Charger sample includes AC `7` kW, AC `11` kW, and motorbike charging sockets.

## Peak Window

- Evening peak window is modeled as `18:00` to `22:00`.
- This window is used to demonstrate unmanaged overload risk and optimizer impact.

## `safe_capacity_kw` in `synthetic_building_load.csv`

- `safe_capacity_kw` is a configurable safety threshold for simulation.
- In the sample file it is set to a constant value to keep before/after comparisons easy to explain.

## EV_999 Security Anomaly

- `EV_999` is intentionally abnormal with `max_charging_kw = 120`.
- It exists only for rule-based security anomaly demonstration.
- It should not be interpreted as a normal charging request profile.

## Needs Verification Before Final Proposal

Validate these items with cited sources before making real-world claims:

- Cong dien 27/CD-TTg technical implications.
- Typical number of chargers in apartment buildings.
- Vietnam/ASEAN charger deployment statistics.
- Tariff values used in billing interpretation.
- Grid emission factor used in environmental impact calculations.
- Typical electric motorbike battery capacity ranges.
- Typical EV car battery capacity ranges.
- Typical AC charger power ratings.
