from fastapi import APIRouter, HTTPException

from ai.load_forecaster import generate_forecast_response

router = APIRouter(prefix="/api", tags=["forecast"])


@router.get("/forecast")
def get_forecast() -> dict:
    """Return next-6-hour base load forecast from lightweight RandomForest model."""
    try:
        return generate_forecast_response()
    except ModuleNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
