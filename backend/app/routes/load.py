import csv
from pathlib import Path

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["load"])


PROJECT_ROOT = Path(__file__).resolve().parents[3]
LOAD_CSV_PATH = PROJECT_ROOT / "data" / "synthetic_building_load.csv"


@router.get("/load")
def get_building_load() -> list[dict]:
    rows: list[dict] = []

    with LOAD_CSV_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(
                {
                    "hour": int(row["hour"]),
                    "base_load_kw": float(row["base_load_kw"]),
                    "safe_capacity_kw": float(row["safe_capacity_kw"]),
                    "unmanaged_ev_load_kw": float(row["unmanaged_ev_load_kw"]),
                }
            )

    return rows
