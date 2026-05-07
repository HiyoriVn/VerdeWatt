from pathlib import Path
import csv

from fastapi import APIRouter

from ai.optimizer import run_optimizer

router = APIRouter(prefix="/api", tags=["allocate"])


PROJECT_ROOT = Path(__file__).resolve().parents[3]
LOAD_CSV_PATH = PROJECT_ROOT / "data" / "synthetic_building_load.csv"
SESSIONS_JSON_PATH = PROJECT_ROOT / "data" / "ev_sessions_sample.json"


def _safe_capacity_by_hour() -> dict[int, float]:
    """Read safe capacity values from CSV and map them by hour."""
    safe_map: dict[int, float] = {}
    with LOAD_CSV_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            safe_map[int(row["hour"])] = float(row["safe_capacity_kw"])
    return safe_map


def _peak_after_under_safe_capacity_kw(result: dict) -> float:
    """How far below safe capacity the optimized peak load is (kW)."""
    hourly_totals = result.get("total_load_after_optimization", [])
    if not hourly_totals:
        return 0.0

    peak_after_entry = max(hourly_totals, key=lambda x: float(x.get("total_load_kw", 0)))
    peak_hour = int(peak_after_entry["hour"])
    peak_after_kw = float(peak_after_entry["total_load_kw"])

    safe_map = _safe_capacity_by_hour()
    safe_capacity_kw = float(safe_map.get(peak_hour, 0.0))

    return round(safe_capacity_kw - peak_after_kw, 2)


def _build_allocate_response() -> dict:
    """Run optimizer and return full result with an extra safety-margin metric."""
    result = run_optimizer(
        building_load_path=LOAD_CSV_PATH,
        ev_sessions_path=SESSIONS_JSON_PATH,
    )

    response = dict(result)
    response["peak_after_under_safe_capacity_kw"] = _peak_after_under_safe_capacity_kw(
        result
    )

    # Keep hourly allocations in response when available from the optimizer.
    if "hourly_allocations" in result:
        response["hourly_allocations"] = result["hourly_allocations"]

    return response


@router.post("/allocate")
def allocate_charging_post() -> dict:
    return _build_allocate_response()


@router.get("/allocate")
def allocate_charging_get() -> dict:
    """Optional GET route for easy browser/manual testing."""
    return _build_allocate_response()
