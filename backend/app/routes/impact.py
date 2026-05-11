from fastapi import APIRouter

from backend.app.services.impact_engine import generate_impact_metrics

router = APIRouter(prefix="/api", tags=["impact"])


@router.get("/impact")
def get_impact() -> dict:
    """Return environmental impact estimates from shifted charging energy."""
    return generate_impact_metrics()
