from backend.app.services.schedule_service import generate_schedule_recommendations


def get_vehicle_recommendation(vehicle_id: str) -> dict | None:
    """Return a single recommendation from the schedule list."""
    target = vehicle_id.strip().lower()
    recommendations = generate_schedule_recommendations(preference="balanced")

    for item in recommendations:
        if str(item.get("vehicle_id", "")).lower() == target:
            return item

    return None
