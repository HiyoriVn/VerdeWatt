from fastapi import APIRouter, Query

from backend.app.services.schedule_service import generate_schedule_recommendations

router = APIRouter(prefix="/api", tags=["schedule"])


@router.get("/schedule")
def get_schedule(
    preference: str = Query(
        default="balanced",
        description="Scheduling mode: cheapest, fastest, or balanced.",
    )
) -> list[dict]:
    return generate_schedule_recommendations(preference=preference)
