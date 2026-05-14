from fastapi import APIRouter

from ai.load_forecaster import (
    generate_forecast_response,
    generate_forecast_response_fallback,
)

router = APIRouter(prefix="/api", tags=["forecast"])


@router.get("/forecast")
def get_forecast() -> dict:
    """Return next-6-hour base load forecast from lightweight RandomForest model."""
    try:
        return generate_forecast_response()
    except ModuleNotFoundError:
        return generate_forecast_response_fallback()
