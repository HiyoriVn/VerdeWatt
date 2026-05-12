import csv

from fastapi import APIRouter

from backend.app.core.constants import LOAD_CSV_PATH

router = APIRouter(prefix="/api", tags=["load"])


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
