from fastapi import APIRouter, HTTPException

from backend.app.services.vehicle_service import get_vehicle_recommendation

router = APIRouter(prefix="/api", tags=["vehicle"])


@router.get("/vehicle/{vehicle_id}")
def get_vehicle_lookup(vehicle_id: str) -> dict:
    """Return one vehicle recommendation by code (case-insensitive)."""
    recommendation = get_vehicle_recommendation(vehicle_id=vehicle_id)
    if recommendation is not None:
        return recommendation

    raise HTTPException(status_code=404, detail="Vehicle code not found")
