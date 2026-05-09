from fastapi import APIRouter, HTTPException

from backend.app.services.scheduler import generate_schedule_recommendations

router = APIRouter(prefix="/api", tags=["vehicle"])


@router.get("/vehicle/{vehicle_id}")
def get_vehicle_lookup(vehicle_id: str) -> dict:
    """Return one vehicle recommendation by code (case-insensitive)."""
    target = vehicle_id.strip().lower()

    recommendations = generate_schedule_recommendations(preference="balanced")

    for item in recommendations:
        if str(item.get("vehicle_id", "")).lower() == target:
            return item

    raise HTTPException(status_code=404, detail="Vehicle code not found")
