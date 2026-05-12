"""Simple rule-based anomaly detector for VerdeWatt MVP.

This module does not use ML. It applies clear, explainable rules and returns
alert dictionaries for frontend/API usage.
"""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
import json
from typing import Any, Dict, List

from backend.app.core.constants import (
    MOCK_CHARGER_HEALTH,
    SAFE_MAX_CHARGING_KW,
    SESSIONS_JSON_PATH,
)


def _now_iso() -> str:
    """Return UTC timestamp in simple ISO format."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _make_alert(
    alert_id: str,
    severity: str,
    title: str,
    message: str,
    suggested_action: str,
    related_session_id: str | None = None,
    related_charger_id: str | None = None,
) -> Dict[str, Any]:
    """Build a standard alert record."""
    return {
        "id": alert_id,
        "timestamp": _now_iso(),
        "severity": severity,
        "title": title,
        "message": message,
        "suggested_action": suggested_action,
        "related_session_id": related_session_id,
        "related_charger_id": related_charger_id,
    }


def load_sessions(path: Path = SESSIONS_JSON_PATH) -> List[Dict[str, Any]]:
    """Load EV sessions from JSON file."""
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def detect_abnormal_power_requests(sessions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Rule 1: Flag sessions asking for charging power above safe threshold."""
    alerts: List[Dict[str, Any]] = []

    for session in sessions:
        session_id = str(session.get("id", "UNKNOWN"))
        requested_kw = float(session.get("max_charging_kw", 0.0))

        if requested_kw > SAFE_MAX_CHARGING_KW:
            alerts.append(
                _make_alert(
                    alert_id=f"ALERT-PWR-{session_id}",
                    severity="High",
                    title="Abnormal power request",
                    message=(
                        f"Session {session_id} requested {requested_kw:.1f} kW, "
                        f"which is above the safe threshold of {SAFE_MAX_CHARGING_KW:.1f} kW."
                    ),
                    suggested_action=(
                        "Cap charging power to a safe value and verify charger/session settings."
                    ),
                    related_session_id=session_id,
                )
            )

    return alerts


def detect_repeated_or_suspicious_sessions(
    sessions: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Rule 2: Flag repeated patterns or suspicious sessions."""
    alerts: List[Dict[str, Any]] = []

    # Pattern: (priority, deadline_hour, max_charging_kw).
    # If repeated enough times, flag as potentially scripted/replayed requests.
    pattern_to_ids: dict[tuple, list[str]] = defaultdict(list)

    for session in sessions:
        session_id = str(session.get("id", "UNKNOWN"))
        pattern = (
            str(session.get("priority", "")).lower(),
            int(session.get("deadline_hour", -1)),
            float(session.get("max_charging_kw", 0.0)),
        )
        pattern_to_ids[pattern].append(session_id)

        marked_suspicious = bool(session.get("suspicious", False))
        looks_suspicious_in_sample = session_id.upper().endswith("999")

        if marked_suspicious or looks_suspicious_in_sample:
            alerts.append(
                _make_alert(
                    alert_id=f"ALERT-SUS-{session_id}",
                    severity="Medium",
                    title="Suspicious session marker",
                    message=(
                        f"Session {session_id} is marked or shaped as suspicious in sample data."
                    ),
                    suggested_action=(
                        "Review session metadata and user identity before allowing full charging."
                    ),
                    related_session_id=session_id,
                )
            )

    for pattern, ids in pattern_to_ids.items():
        if len(ids) >= 3:
            first_id = ids[0]
            alerts.append(
                _make_alert(
                    alert_id=f"ALERT-REP-{first_id}",
                    severity="Medium",
                    title="Repeated session pattern",
                    message=(
                        "Multiple sessions share the same request pattern "
                        f"(priority={pattern[0]}, deadline_hour={pattern[1]}, "
                        f"max_charging_kw={pattern[2]:.1f}). IDs: {', '.join(ids)}"
                    ),
                    suggested_action=(
                        "Check if requests are automated duplicates and rate-limit if needed."
                    ),
                    related_session_id=first_id,
                )
            )

    return alerts


def detect_charger_offline_or_dos_like() -> List[Dict[str, Any]]:
    """Rule 3: Flag offline chargers or too many failed pings (DoS-like)."""
    alerts: List[Dict[str, Any]] = []

    for item in MOCK_CHARGER_HEALTH:
        charger_id = str(item.get("charger_id", "UNKNOWN"))
        offline = bool(item.get("offline", False))
        failed_pings = int(item.get("failed_pings", 0))

        if offline:
            alerts.append(
                _make_alert(
                    alert_id=f"ALERT-OFF-{charger_id}",
                    severity="High",
                    title="Charger offline",
                    message=(
                        f"Charger {charger_id} is offline with {failed_pings} failed pings."
                    ),
                    suggested_action=(
                        "Inspect charger network and restart the device if connectivity is lost."
                    ),
                    related_charger_id=charger_id,
                )
            )
        elif failed_pings >= 5:
            alerts.append(
                _make_alert(
                    alert_id=f"ALERT-DOS-{charger_id}",
                    severity="Medium",
                    title="DoS-like ping failures",
                    message=(
                        f"Charger {charger_id} reported {failed_pings} failed pings in a short window."
                    ),
                    suggested_action=(
                        "Monitor traffic and apply rate limits or network filtering if needed."
                    ),
                    related_charger_id=charger_id,
                )
            )

    return alerts


def generate_sample_alerts() -> List[Dict[str, Any]]:
    """Generate alerts from rule-based checks for demo/API use."""
    sessions = load_sessions()

    alerts: List[Dict[str, Any]] = []
    alerts.extend(detect_abnormal_power_requests(sessions))
    alerts.extend(detect_repeated_or_suspicious_sessions(sessions))
    alerts.extend(detect_charger_offline_or_dos_like())

    return alerts
