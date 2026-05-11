# VerdeWatt Audit Report

## 1. Current Project Status

VerdeWatt currently has a working MVP structure:

- Python FastAPI backend with routes for load, sessions, allocation, alerts, billing, schedule, vehicle lookup, charger commands, forecast, and impact.
- Rule-based optimizer, scheduler, anomaly detection, billing simulation, and OCPP-compatible mock command layer.
- React + Vite + Recharts frontend dashboard with API integration for core endpoints.
- Synthetic sample data files in `data/` match expected core schema.

What was verified in this audit:

- Static inspection across `README.md`, `AGENTS.md`, `docs/`, `data/`, `ai/`, `backend/`, `frontend/`, `security/`, `finance/`.
- Frontend production build (`npm.cmd run build`) succeeds.
- Backend runtime checks could not be executed here because Python is not installed in this environment.

## 2. Critical Blockers

| File | Problem | Why it matters | Fix status |
| --- | --- | --- | --- |
| `ai/load_forecaster.py` + `backend/app/routes/forecast.py` | Forecast module previously hard-failed backend startup if `scikit-learn` was missing. | `uvicorn backend.app.main:app --reload` could crash before serving any endpoint. | fixed |
| `frontend/src/components/EVSessionCard.jsx` | JSX text used `->` in a way that triggered build/parser warning. | Weakens demo stability and CI/build confidence. | fixed |
| Local environment (runtime) | Python interpreter unavailable in this audit environment (`python` and `py` not found). | Could not run `python ai/optimizer.py`, `python ai/load_forecaster.py`, or backend server here. | needs human decision |
| Source control state | Route/service/docs files for forecast/impact are present locally but currently untracked in git. | Teammates will not receive them until committed, causing import/runtime mismatch on other machines. | needs human decision |

## 3. High Priority Issues

| File | Issue | Why it matters | Fix status |
| --- | --- | --- | --- |
| `docs/api-spec.md` | Missing docs for `/api/forecast` and `/api/impact` before this audit. | API/frontend collaboration risk and proposal inconsistency. | fixed |
| `docs/algorithm.md` | Outdated description of optimizer output (`peak_after_under_safe_capacity_kw` treated like boolean). | Confuses backend/frontend contract and judge explanation. | fixed |
| `README.md` | Windows venv activation instructions were shell-ambiguous. | New teammates may fail setup. | fixed |
| `docs/proposal-outline.md` | Missing file. | Proposal preparation blocker for hackathon submission quality. | not fixed |
| `docs/demo-script.md`, `docs/proposal-notes.md`, `security/threat_model.md`, `finance/assumptions.md` | Empty placeholder docs. | Lowers proposal credibility and demo readiness. | not fixed |
| `docs/architecture.md` | Endpoint usage section covers only part of implemented API surface. | Documentation drift over time. | not fixed |

## 4. Medium Priority Issues

| File | Issue | Why it matters | Fix status |
| --- | --- | --- | --- |
| Frontend build output | Bundle size warning (`>500 kB` chunk). | Not a blocker, but page load performance can degrade on weaker demo laptops. | not fixed |
| Frontend integration scope | `/api/forecast` and `/api/impact` are backend-ready but not yet shown on dashboard. | Missed opportunity to strengthen AI + green impact story in demo. | not fixed |
| Test coverage | No automated backend/frontend tests in repo. | Regression risk as features grow quickly. | not fixed |

## 5. Scope Risks

- **AI/ML overclaim risk:** Forecasting is MVP-level RandomForest on augmented synthetic data, not real utility-grade forecasting.
- **OCPP overclaim risk:** Current implementation is mock command generation only, not full OCPP protocol/hardware control.
- **Green impact overclaim risk:** Emission constants are assumptions; final submission should include cited official sources.
- **Security overclaim risk:** Detection is rule-based anomaly screening, not a full production SOC/SIEM system.

## 6. API Contract Check

| Endpoint | Backend exists? | Frontend uses it? | Documented in API spec? | Status |
| --- | --- | --- | --- | --- |
| `GET /health` | Yes | No | Yes | OK (backend health check) |
| `GET /api/load` | Yes | Yes | Yes | OK |
| `GET /api/sessions` | Yes | Yes | Yes | OK |
| `POST /api/allocate` | Yes | Yes | Yes | OK |
| `GET /api/allocate` | Yes | No | Yes | OK (helper route) |
| `GET /api/alerts` | Yes | Yes | Yes | OK |
| `POST /api/billing` | Yes | Yes | Yes | OK |
| `GET /api/forecast` | Yes | No | Yes | Backend ready, frontend pending |
| `GET /api/impact` | Yes | No | Yes | Backend ready, frontend pending |
| `GET /api/schedule` | Yes | Yes | Yes | OK |
| `GET /api/vehicle/{vehicle_id}` | Yes | Yes | Yes | OK |
| `GET /api/charger-commands` | Yes | Yes | Yes | OK |

## 7. Data Contract Check

### `data/synthetic_building_load.csv`

- Columns present: `hour`, `base_load_kw`, `safe_capacity_kw`, `unmanaged_ev_load_kw`.
- `hour` covers 0..23.
- `safe_capacity_kw` is consistently `120`.
- Unmanaged overload condition is satisfied:
  - unmanaged total peak = `154 kW`
  - exceeds safe capacity at hours `18,19,20,21,22`.

### `data/ev_sessions_sample.json`

- Contains 12 sessions.
- Required fields present per session: `id`, `current_soc`, `target_soc`, `battery_kwh`, `deadline_hour`, `priority`, `max_charging_kw`.
- Includes 4 urgent sessions (>=3 requirement satisfied).
- Includes abnormal test case `EV_999` with `max_charging_kw = 120` for anomaly/security testing.

## 8. Frontend Integration Check

### API Functions (`frontend/src/services/api.js`)

- `getLoad()` -> `GET /api/load`
- `getSessions()` -> `GET /api/sessions`
- `runAllocation()` -> `POST /api/allocate`
- `getAlerts()` -> `GET /api/alerts`
- `getBilling()` -> `POST /api/billing`
- `getSchedule()` -> `GET /api/schedule`
- `getVehicle(vehicleId)` -> `GET /api/vehicle/{vehicle_id}`
- `getChargerCommands()` -> `GET /api/charger-commands`

### Component Mapping

- `LoadCurveChart` -> load curve data (+ local `unmanaged_total_load_kw` computation)
- `EVSessionCard` -> session list
- `AllocationSummary` -> allocation metrics
- `KPICards` -> billing KPIs
- `SecurityAlertFeed` -> alert feed
- `VehicleLookup` -> single vehicle recommendation
- `ScheduleRecommendations` -> schedule table
- `ChargerCommandPanel` -> mock charger commands

### Mismatch Findings

- No critical field-name mismatch found in current integrated components.
- `/api/forecast` and `/api/impact` are not yet consumed by frontend components.

## 9. Documentation Consistency Check

- `README.md`: aligned to Python FastAPI backend, updated activation guidance, and expanded expected endpoint list.
- `docs/api-spec.md`: now includes all major implemented endpoints, including forecast and impact.
- `docs/algorithm.md`: now aligned with numeric `peak_after_under_safe_capacity_kw` metric and `peak_after_is_safe`.
- Remaining inconsistencies/gaps:
  - `docs/architecture.md` endpoint coverage is partial.
  - Several proposal-support docs are empty or missing (`docs/proposal-outline.md`, `docs/demo-script.md`, `docs/proposal-notes.md`, `security/threat_model.md`, `finance/assumptions.md`).

## 10. Recommended Next Phases

### Phase 1: Stabilize Current Backend/Frontend
- Goal: freeze a reliable demo baseline.
- Tasks:
  - Commit all currently implemented forecast/impact route/service/doc files.
  - Run backend locally with Python and verify all Swagger endpoints.
  - Keep graceful error behavior for optional dependencies.
- Owner suggestion: Backend lead + Integration lead.
- Definition of Done:
  - `uvicorn backend.app.main:app --reload` starts cleanly.
  - Core endpoints return valid JSON.
  - Frontend build + manual dashboard flow pass.
- Risk: uncommitted/untracked files causing teammate environment breakage.

### Phase 2: Finalize ML Forecasting (`/api/forecast`)
- Goal: make forecast demo-ready and defensible.
- Tasks:
  - Validate response values and add a small forecast panel on frontend.
  - Add citation notes for synthetic-data limitation.
- Owner suggestion: AI/ML owner.
- Definition of Done:
  - Forecast endpoint and UI card both working.
  - Clear MVP disclaimer shown in docs/demo script.
- Risk: overclaiming prediction quality from synthetic data.

### Phase 3: Finalize Green Impact (`/api/impact`)
- Goal: strengthen green-future narrative with transparent assumptions.
- Tasks:
  - Integrate impact endpoint into KPI section.
  - Attach source references for constants in proposal materials.
- Owner suggestion: Sustainability/analysis owner.
- Definition of Done:
  - Impact metrics visible in UI.
  - Assumptions and sources documented.
- Risk: unsupported constants reduce credibility with judges.

### Phase 4: Harden Scheduler + Vehicle Lookup
- Goal: make resident-facing recommendations consistent and testable.
- Tasks:
  - Add simple scenario checks for statuses (`charging_now`, `needs_attention`, etc.).
  - Verify case-insensitive lookup and 404 behavior manually.
- Owner suggestion: Backend lead + frontend integrator.
- Definition of Done:
  - `/api/schedule` and `/api/vehicle/{vehicle_id}` validated with sample IDs.
  - UI shows clear fallback messages for missing vehicle.
- Risk: time-dependent status logic can cause confusing demo output.

### Phase 5: Harden OCPP-Compatible Mock Commands
- Goal: keep cybersecure control story clear without full OCPP scope creep.
- Tasks:
  - Validate command generation for urgent/flexible/suspicious cases.
  - Ensure docs repeatedly label this as mock-only.
- Owner suggestion: Backend/security owner.
- Definition of Done:
  - `/api/charger-commands` examples align with scheduler + alerts.
  - Mock-only scope is explicit in API/docs/pitch.
- Risk: judges may assume real hardware integration if messaging is unclear.

### Phase 6: Proposal Assets and Evidence Pack
- Goal: maximize preliminary-round credibility.
- Tasks:
  - Fill missing docs (`proposal-outline`, demo script, threat model, assumptions, proposal notes).
  - Capture screenshots and endpoint output evidence.
  - Align claims across README, docs, and pitch deck.
- Owner suggestion: PM/docs owner + all module owners for review.
- Definition of Done:
  - Proposal outline complete.
  - Demo script rehearsable end-to-end in <5 minutes.
  - No overclaim gaps between pitch and implementation.
- Risk: documentation debt can block submission quality.

### Phase 7: UI Polish and Final Freeze
- Goal: deliver a stable, understandable final demo.
- Tasks:
  - Add compact forecast + impact cards.
  - Minor performance cleanup (bundle split only if needed).
  - Freeze features and run final regression checklist.
- Owner suggestion: Frontend lead + QA rotation.
- Definition of Done:
  - All core screens stable on demo hardware.
  - Final checklist passes.
- Risk: late scope changes can destabilize demo.
