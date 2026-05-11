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

This backend is Python FastAPI only (not a Node.js backend).

Run these commands from the project root on a machine with Python installed:

1. Create a virtual environment.
```bash
python -m venv .venv
```
2. Activate the virtual environment.
Windows (PowerShell):
```bash
.venv\Scripts\Activate.ps1
```
Windows (Command Prompt):
```bash
.venv\Scripts\activate.bat
```
Windows (Git Bash):
```bash
source .venv/Scripts/activate
```
macOS/Linux:
```bash
source .venv/bin/activate
```
3. Install backend dependencies.
```bash
pip install -r backend/requirements.txt
```
4. Start the backend server locally.
```bash
uvicorn backend.app.main:app --reload
```

Expected local URLs:
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/api/load`
- `http://127.0.0.1:8000/api/sessions`
- `http://127.0.0.1:8000/api/allocate`
- `http://127.0.0.1:8000/api/alerts`
- `http://127.0.0.1:8000/api/billing`
- `http://127.0.0.1:8000/api/schedule`
- `http://127.0.0.1:8000/api/vehicle/EV_001`
- `http://127.0.0.1:8000/api/charger-commands`
- `http://127.0.0.1:8000/api/forecast`
- `http://127.0.0.1:8000/api/impact`
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
