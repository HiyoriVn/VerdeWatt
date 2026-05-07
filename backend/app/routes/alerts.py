from fastapi import APIRouter

from backend.app.services.anomaly_detector import generate_sample_alerts

router = APIRouter(prefix="/api", tags=["alerts"])


@router.get("/alerts")
def get_alerts() -> list[dict]:
    """Return sample security alerts from rule-based anomaly detection."""
    return generate_sample_alerts()
