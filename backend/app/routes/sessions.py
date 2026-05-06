import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["sessions"])


PROJECT_ROOT = Path(__file__).resolve().parents[3]
SESSIONS_JSON_PATH = PROJECT_ROOT / "data" / "ev_sessions_sample.json"


@router.get("/sessions")
def get_ev_sessions() -> list[dict]:
    with SESSIONS_JSON_PATH.open("r", encoding="utf-8") as f:
        sessions = json.load(f)

    return sessions
