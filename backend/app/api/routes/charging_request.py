from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

from backend.app.services.schedule_service import create_charging_request_recommendation

router = APIRouter(prefix="/api", tags=["charging-request"])


class ChargingRequestPayload(BaseModel):
    vehicle_id: str = Field(..., min_length=1)
    current_soc: float = Field(..., ge=0, le=100)
    target_soc: float = Field(..., ge=0, le=100)
    battery_kwh: float = Field(..., gt=0)
    deadline_hour: int = Field(..., ge=0, le=23)
    preference: Literal["fastest", "cheapest", "balanced"] = "balanced"


@router.post("/charging-request")
def create_charging_request(payload: ChargingRequestPayload) -> dict:
    """Register a user charging request and return one scheduling recommendation."""
    return create_charging_request_recommendation(payload.model_dump())
