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

## Not in MVP

- No LSTM
- No real payment integration
- No full OCPP implementation
- No real charger hardware integration
- No native mobile app