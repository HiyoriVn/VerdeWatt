from fastapi import APIRouter

from backend.app.api.routes.alerts import router as alerts_router
from backend.app.api.routes.allocation import router as allocation_router
from backend.app.api.routes.billing import router as billing_router
from backend.app.api.routes.charging_request import router as charging_request_router
from backend.app.api.routes.charger_commands import router as charger_commands_router
from backend.app.api.routes.forecast import router as forecast_router
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.impact import router as impact_router
from backend.app.api.routes.load import router as load_router
from backend.app.api.routes.schedule import router as schedule_router
from backend.app.api.routes.sessions import router as sessions_router
from backend.app.api.routes.vehicle import router as vehicle_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(load_router)
api_router.include_router(sessions_router)
api_router.include_router(allocation_router)
api_router.include_router(alerts_router)
api_router.include_router(billing_router)
api_router.include_router(charging_request_router)
api_router.include_router(charger_commands_router)
api_router.include_router(forecast_router)
api_router.include_router(impact_router)
api_router.include_router(schedule_router)
api_router.include_router(vehicle_router)
