# AGENTS.md — VerdeWatt Development Guide

## Project overview

VerdeWatt is a hackathon MVP for AI-powered, cybersecure smart EV charging in high-rise apartment buildings.

The system helps building managers:
- forecast building electricity load,
- allocate EV charging power safely,
- avoid exceeding safe building capacity,
- estimate billing and impact KPIs,
- detect abnormal charging behavior.

The MVP is designed for a 13-day student hackathon sprint. Keep all code simple, readable, and demo-ready.

---

## Core product story

The demo should prove this story:

1. A high-rise apartment building has normal electricity load.
2. During evening peak hours, many EVs charge at the same time.
3. Without VerdeWatt, total load exceeds the safe capacity limit.
4. VerdeWatt forecasts load and reallocates EV charging power.
5. After optimization, total load stays under the safe capacity limit.
6. The dashboard shows peak reduction, cost/impact KPIs, and security alerts.

Everything we build should support this story.

---

## Tech stack

Use only the approved MVP stack:

### Frontend
- React
- Vite
- Recharts

### Backend
- Python 3.11.x
- FastAPI
- Pydantic
- Uvicorn

### AI / Optimizer
- pandas
- numpy
- rule-based logic
- weighted moving average
- greedy priority queue

### Data
- CSV files
- JSON files

### Optional only if needed
- SQLite
- SQLAlchemy

---

## Explicitly out of scope

Do NOT add the following unless the team explicitly requests it:

- LSTM
- deep learning training
- real payment integration
- full OCPP implementation
- real EV charger / IoT hardware integration
- blockchain
- authentication system
- user account system
- Docker setup
- Kubernetes
- WebSocket realtime system
- complex database migrations
- microservices
- cloud-specific lock-in

If a task seems to require one of these, propose a simpler MVP-friendly alternative.

---

## Development rules

### Keep code beginner-friendly

Most team members are second-year university students. Prioritize:

- clear function names,
- short files,
- comments for non-obvious logic,
- simple data structures,
- readable outputs,
- minimal dependencies.

Avoid clever abstractions.

### Keep demo stability above technical sophistication

A simple rule-based algorithm that runs reliably is better than a complex model that is hard to explain or debug.

### Prefer CSV/JSON for MVP data

Use:
- `data/synthetic_building_load.csv`
- `data/ev_sessions_sample.json`

Do not introduce database dependency unless necessary.

### Backend command must stay stable

The backend must run from the project root with:

```bash
uvicorn backend.app.main:app --reload
```

Do not require manual PYTHONPATH changes.

### Optimizer command must stay stable

The optimizer must run from the project root with:

```bash
python ai/optimizer.py
```

It should print a readable validation summary.

---

## Expected backend endpoints

The FastAPI backend should expose:

```text
GET  /health
GET  /api/load
GET  /api/sessions
POST /api/allocate
GET  /api/alerts
POST /api/billing
```

Swagger docs should be available at:

```text
http://127.0.0.1:8000/docs
```

---

## Data expectations

### Building load CSV

File:

```text
data/synthetic_building_load.csv
```

Expected fields:

```text
hour
base_load_kw
safe_capacity_kw
unmanaged_ev_load_kw
```

The unmanaged scenario should exceed safe capacity during evening peak hours.

### EV sessions JSON

File:

```text
data/ev_sessions_sample.json
```

Expected fields per EV:

```text
id
current_soc
target_soc
battery_kwh
deadline_hour
priority
max_charging_kw
```

Priority values:

```text
urgent
normal
flexible
```

---

## Optimizer requirements

The optimizer should:

1. Calculate spare capacity:

```text
spare_capacity_kw = safe_capacity_kw - base_load_kw
```

2. Sort EVs by:

   * priority: urgent > normal > flexible
   * earliest deadline

3. Allocate charging power without exceeding safe capacity.

4. Respect each EV's `max_charging_kw`.

5. Return metrics:

```text
peak_before_kw
peak_after_kw
peak_reduction_kw
peak_reduction_percent
evs_fully_served
evs_partially_served
peak_after_under_safe_capacity_kw
```

6. Keep logic rule-based and explainable.

---

## Security module requirements

The security module should be rule-based.

Include at least three anomaly rules:

1. Abnormal current or power request
2. Repeated or fake charging session
3. Charger offline / DoS-like behavior

Each alert should include:

```text
id
timestamp
severity
message
suggested_action
related_charger_id or related_session_id
```

Severity values:

```text
Low
Medium
High
```

---

## Billing module requirements

The billing module should be a simulation only.

It may calculate:

```text
total_kwh
peak_kwh
offpeak_kwh
estimated_cost_vnd
estimated_saving_vnd
shifted_kwh
incentive_value_vnd
```

Do not integrate real payments.

---

## Frontend requirements

The dashboard should clearly show:

1. Building load curve
2. Safe capacity red line
3. EV session cards
4. Before/after allocation visualization
5. KPI cards
6. Security alert feed

Use mock data first if APIs are not ready, but keep the data shape close to backend responses.

---

## File ownership conventions

### Technical Markdown docs in repo

Use the repo `docs/` folder for technical markdown files:

```text
docs/architecture.md
docs/algorithm.md
docs/api-spec.md
docs/billing-spec.md
docs/demo-script.md
docs/proposal-notes.md
```

### Non-code documents in Google Drive

Use Google Drive for:

* proposal `.docx` / `.pdf`,
* pitch deck,
* demo video,
* screenshots,
* ROI Excel model,
* research papers,
* submission exports.

---

## Commit style

Use simple commit messages:

```text
feat: add FastAPI backend setup
feat: implement greedy EV charging optimizer
data: add synthetic EV charging scenarios
docs: explain optimizer algorithm
fix: resolve backend import path
chore: update README setup instructions
```

---

## Before finishing any task

Check:

1. Does it support the core demo story?
2. Does it stay within MVP scope?
3. Can it run locally with documented commands?
4. Did it avoid LSTM, real payment, full OCPP, auth, blockchain, and unnecessary database setup?
5. Is the code readable for second-year students?

If not, simplify before finalizing.
