# Data Assumptions for VerdeWatt MVP

This document defines which values are demo assumptions and which values need verification before final proposal claims.
The goal is a defensible MVP scenario, not an official national benchmark.

| Parameter | MVP value | Why used | Source status | Proposal wording |
| --- | --- | --- | --- | --- |
| Scenario scope | One representative apartment/residential charging area | Keeps the demo story concrete and easy to explain | Demo assumption | This MVP models one representative residential charging scenario for demonstration only. |
| Daily profile | 24-hour timeline (`0`-`23`) | Aligns load, allocation, billing, and alert outputs in one cycle | Verified | We use a full-day synthetic profile to show before/after charging behavior. |
| Evening peak window | `18:00`-`22:00` | Shows realistic return-home charging overlap and contention | Demo assumption | The scenario assumes peak simultaneous charging in the evening window (18:00-22:00). |
| `safe_capacity_kw` role | Configurable safety threshold in simulation (`120` kW in current sample) | Provides a clear boundary for overload-vs-safe visualization | Demo assumption | The MVP uses a configurable safety threshold and currently demonstrates with a 120 kW sample value. |
| EV session count | `22` sessions | Rich enough for dashboard cards/charts while still beginner-friendly | Demo assumption | The current demo dataset contains 22 synthetic sessions for one operating day. |
| Vehicle mix | Electric motorbikes + small EV cars + standard EV cars | Avoids car-only simplification and better reflects mixed residential demand | Demo assumption | The vehicle mix is an MVP scenario assumption and is not claimed as an official average. |
| Typical number of chargers in apartment buildings | Current sample: `12` chargers total | Provides enough assets for allocation and security demo flows | Needs verification | Charger quantity is a scenario assumption and must be validated before real-world claims. |
| Vietnam/ASEAN charger deployment statistics | Not asserted in dataset | Prevents unsupported regional adoption claims | Needs verification | No regional deployment claim should be made without verified external statistics. |
| Cong dien 27/CD-TTg technical implications | Policy context only, no numeric mandate claimed | Prevents over-claiming regulatory requirements | Needs verification | Cong dien 27/CD-TTg is treated as context only until exact technical implications are verified. |
| Typical electric motorbike battery capacity | `2`-`5` kWh in sample sessions | Distinguishes motorbike sessions from EV cars | Needs verification | Motorbike battery range is a demo assumption pending source-backed validation. |
| Typical EV car battery capacity | Small EV: `30`-`45` kWh; standard EV: `50`-`75` kWh | Creates realistic diversity in charging demand | Needs verification | EV battery ranges are provisional scenario assumptions pending verified references. |
| AC charger power ratings | `7` kW and `11` kW tiers in sample | Supports explainable, rule-based allocation behavior | Needs verification | AC charger power tiers are assumed for MVP and should be confirmed with referenced specs. |
| Tariff values for billing | Peak/off-peak tariff split from MVP module settings | Required for estimated cost/saving simulation output | Needs verification | Billing values are simulation-only and tariff inputs require official source verification. |
| Emission factor for impact KPIs | Placeholder factor from MVP assumptions | Enables CO2 impact visualization in demo | Needs verification | Emission factor values are provisional and must be cited before proposal finalization. |
| Security anomaly marker | `EV_999` with `max_charging_kw = 120` and `CH_X_99` unavailable | Validates anomaly detection and alert messaging path | Verified | A deliberate anomaly record is included to demonstrate rule-based cyber alert behavior. |

## Presentation Guardrails

- Always describe this dataset as synthetic MVP scenario data.
- Do not claim charger count or vehicle mix as official Vietnamese/ASEAN averages.
- Do not claim Cong dien 27/CD-TTg mandates specific charger numbers unless a verified source is attached.
