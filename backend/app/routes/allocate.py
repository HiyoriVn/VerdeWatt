from pathlib import Path

from fastapi import APIRouter

from ai.optimizer import run_optimizer

router = APIRouter(prefix="/api", tags=["allocate"])


PROJECT_ROOT = Path(__file__).resolve().parents[3]
LOAD_CSV_PATH = PROJECT_ROOT / "data" / "synthetic_building_load.csv"
SESSIONS_JSON_PATH = PROJECT_ROOT / "data" / "ev_sessions_sample.json"


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
