from fastapi import APIRouter, Query

from backend.app.services.ocpp_mock import generate_mock_charger_commands

router = APIRouter(prefix="/api", tags=["charger-commands"])


@router.get("/charger-commands")
def get_charger_commands(
    preference: str = Query(
        default="balanced",
        description="Scheduler preference: cheapest, fastest, or balanced.",
    )
) -> list[dict]:
    """Return mock OCPP-style charger commands for demo usage."""
    return generate_mock_charger_commands(preference=preference)
