import json

from fastapi import APIRouter

from backend.app.core.constants import SESSIONS_JSON_PATH

router = APIRouter(prefix="/api", tags=["sessions"])


@router.get("/sessions")
def get_ev_sessions() -> list[dict]:
    with SESSIONS_JSON_PATH.open("r", encoding="utf-8") as f:
        sessions = json.load(f)

    return sessions
