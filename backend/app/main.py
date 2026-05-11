from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.allocate import router as allocate_router
from backend.app.routes.alerts import router as alerts_router
from backend.app.routes.billing import router as billing_router
from backend.app.routes.charger_commands import router as charger_commands_router
from backend.app.routes.forecast import router as forecast_router
from backend.app.routes.health import router as health_router
from backend.app.routes.impact import router as impact_router
from backend.app.routes.load import router as load_router
from backend.app.routes.schedule import router as schedule_router
from backend.app.routes.sessions import router as sessions_router
from backend.app.routes.vehicle import router as vehicle_router

app = FastAPI(
    title="VerdeWatt Backend API",
    description="API for building load, EV sessions, and smart charging allocation.",
    version="0.1.0",
)

# CORS setup for local frontend development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(load_router)
app.include_router(sessions_router)
app.include_router(allocate_router)
app.include_router(alerts_router)
app.include_router(billing_router)
app.include_router(charger_commands_router)
app.include_router(forecast_router)
app.include_router(impact_router)
app.include_router(schedule_router)
app.include_router(vehicle_router)
