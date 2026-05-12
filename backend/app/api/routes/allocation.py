from fastapi import APIRouter

from ai.optimizer import run_optimizer
from backend.app.core.constants import LOAD_CSV_PATH, SESSIONS_JSON_PATH

router = APIRouter(prefix="/api", tags=["allocate"])


def _build_allocate_response() -> dict:
    """Run optimizer and return its full response."""
    return run_optimizer(
        building_load_path=LOAD_CSV_PATH,
        ev_sessions_path=SESSIONS_JSON_PATH,
    )


@router.post("/allocate")
def allocate_charging_post() -> dict:
    return _build_allocate_response()


@router.get("/allocate")
def allocate_charging_get() -> dict:
    """Optional GET route for easy browser/manual testing."""
    return _build_allocate_response()
