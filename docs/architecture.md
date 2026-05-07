# VerdeWatt Architecture (MVP)

This document explains the VerdeWatt system architecture in simple terms for learning and demo use.

## 1. High-Level System Overview

VerdeWatt is an MVP that simulates smart EV charging for apartment buildings.

It has two main parts:

- **Backend (FastAPI):** reads data, runs optimization, simulates billing, and generates security alerts.
- **Frontend (React + Vite):** shows charts, cards, and alerts on a dashboard.

The backend and frontend communicate through REST APIs.

## 2. Data Flow

Main data flow in the MVP:

1. Synthetic input files are stored in `data/`:
   - `synthetic_building_load.csv`
   - `ev_sessions_sample.json`
2. FastAPI endpoints load these files.
3. Backend services process the data:
   - optimizer service
   - billing service
   - anomaly detection service
4. API responses are returned as JSON.
5. React dashboard fetches the JSON and renders charts/cards/alerts.

Short flow:

`CSV/JSON -> FastAPI routes -> optimizer/billing/security services -> JSON response -> React dashboard`

## 3. Main Modules

### A. Load Data Module

- File: `backend/app/routes/load.py`
- Reads hourly building load from CSV.
- Used for load visualization and capacity context.

### B. EV Sessions Module

- File: `backend/app/routes/sessions.py`
- Reads EV charging sessions from JSON.
- Used for session cards and optimization input.

### C. Optimizer Module

- File: `ai/optimizer.py`
- Uses a rule-based greedy strategy:
  - computes spare capacity each hour
  - prioritizes urgent/earlier-deadline sessions
  - allocates charging without exceeding limits
- API route: `backend/app/routes/allocate.py`

### D. Billing Module

- Files:
  - `backend/app/services/billing_engine.py`
  - `backend/app/routes/billing.py`
- Simulates billing and impact KPIs:
  - total kWh
  - peak/off-peak kWh
  - shifted kWh
  - estimated cost/savings/incentive

### E. Security Anomaly Module

- Files:
  - `backend/app/services/anomaly_detector.py`
  - `backend/app/routes/alerts.py`
- Rule-based checks for:
  - abnormal power request
  - suspicious/repeated session pattern
  - offline/DoS-like charger behavior

### F. Frontend Dashboard

- Folder: `frontend/src/`
- Main UI sections:
  - Load curve chart
  - EV session cards
  - Allocation summary
  - KPI cards
  - Security alert feed

## 4. API Endpoints and Frontend Usage

- `GET /health`
  - Purpose: backend status check
  - Frontend usage: dev/startup check

- `GET /api/load`
  - Purpose: building load curve data
  - Frontend component: `LoadCurveChart`

- `GET /api/sessions`
  - Purpose: EV session list
  - Frontend component: `EVSessionCard`

- `POST /api/allocate`
  - Purpose: run smart charging optimization
  - Frontend component: `AllocationSummary`

- `GET /api/alerts`
  - Purpose: return anomaly alerts
  - Frontend component: `SecurityAlertFeed`

- `POST /api/billing`
  - Purpose: return billing and impact KPIs
  - Frontend component: `KPICards`

## 5. Why MVP Uses CSV/JSON Instead of a Database

For a hackathon MVP, CSV/JSON is a practical choice:

- very fast to set up
- easy to read and edit
- no database server setup needed
- simple to demo and debug

This keeps the team focused on core logic and dashboard storytelling.

## 6. Why MVP Uses Rule-Based Optimization Instead of LSTM

The MVP uses rule-based logic because it is:

- easier to explain to judges and teammates
- deterministic (same input gives same output)
- easier to test and debug
- possible without collecting large historical datasets

LSTM and other deep learning methods are more complex and usually require more data, training time, and model monitoring.

## 7. Future Architecture Roadmap

Possible next steps after MVP:

1. **Real smart meter data**
   - replace synthetic load input with live meter streams
2. **OCPP-compatible charger integration**
   - connect charging stations using standard charger protocols
3. **Database layer**
   - store sessions, loads, alerts, and KPI history
4. **Authentication and roles**
   - secure access for admins/operators/residents
5. **Deployment architecture**
   - production hosting, monitoring, logs, and scaling

This roadmap keeps the MVP foundation but evolves it into a production-ready platform over time.
