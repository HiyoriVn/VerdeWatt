# VerdeWatt

VerdeWatt is an AI-powered and cybersecure smart EV charging platform for high-rise buildings.

## Problem

As EV adoption grows in dense Asian cities, many apartment buildings face a new bottleneck: multiple EVs charging at the same time during evening peak hours can overload building electrical capacity, increase safety risks, and slow down the transition to low-carbon mobility.

## Solution

VerdeWatt forecasts building electricity demand, calculates safe spare capacity, dynamically allocates charging power across EV sessions, estimates cost savings, and detects abnormal charging behavior.

## MVP Features

- Building load simulation
- EV charging session simulation
- Dynamic charging allocation optimizer
- FastAPI backend
- React dashboard
- Billing and impact KPI
- Security alert module

## Tech Stack

- Frontend: React + Vite + Recharts
- Backend: Python FastAPI
- AI/Optimizer: pandas + numpy
- Data: CSV + JSON
- Database: SQLite optional
- Deploy: Vercel + Railway

## Backend Setup (FastAPI)

Run these commands from the project root:

1. Create and activate a virtual environment.
```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate
```
2. Install backend dependencies.
```bash
pip install -r backend/requirements.txt
```
3. Start the backend server locally.
```bash
uvicorn backend.app.main:app --reload
```

Backend URL:
- `http://127.0.0.1:8000`

Swagger docs:
- `http://127.0.0.1:8000/docs`

## Not in MVP

- No LSTM
- No real payment integration
- No full OCPP implementation
- No real charger hardware integration
- No native mobile app

## Sample Data

- `data/synthetic_building_load.csv`: 24-hour building profile with constant `safe_capacity_kw` of 120, low overnight base load, moderate daytime load, and evening peak stress where unmanaged EV load pushes total demand above safe capacity.
- `data/ev_sessions_sample.json`: 12 sample EV charging sessions for scheduling tests, including urgent, normal, and flexible priorities plus one intentionally abnormal session (`EV_999` with unusually high `max_charging_kw`) for security/anomaly testing.

