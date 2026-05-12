from fastapi import APIRouter

from backend.app.services.ocpp_mock import generate_mock_charger_commands

router = APIRouter(prefix="/api", tags=["charger-commands"])


@router.get("/charger-commands")
def get_charger_commands() -> list[dict]:
    """Return mock charger control commands derived from anomaly alerts."""
    return generate_mock_charger_commands()
