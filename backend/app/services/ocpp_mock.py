"""Generate mock OCPP-like control commands from security alerts.

This module is intentionally mock-only for MVP demos. It does not implement
real OCPP sessions, WebSocket communication, or charger hardware control.
"""

from __future__ import annotations

from typing import Any, Dict, List

from backend.app.services.anomaly_detector import generate_sample_alerts


MOCK_NOTE = "MVP mock command, not a real OCPP implementation"


def _charger_id_from_ev(ev_id: str | None) -> str:
    """Map EV IDs like EV_006 to demo charger IDs like CHG_06."""
    if not ev_id:
        return "CHG_00"

    digits = "".join(char for char in ev_id if char.isdigit())
    if not digits:
        return "CHG_00"

    return f"CHG_{int(digits) % 100:02d}"


def _build_command(
    *,
    charger_id: str,
    command: str,
    reason: str,
    related_ev_id: str | None = None,
    max_current_amp: int | None = None,
) -> Dict[str, Any]:
    """Build standard mock command output."""
    payload: Dict[str, Any] = {
        "charger_id": charger_id,
        "related_ev_id": related_ev_id,
        "command": command,
        "reason": reason,
        "status": "mock_only",
        "note": MOCK_NOTE,
    }

    if max_current_amp is not None:
        payload["max_current_amp"] = max_current_amp

    return payload


def generate_mock_charger_commands(alerts: List[Dict[str, Any]] | None = None) -> List[Dict[str, Any]]:
    """Convert anomaly alerts into mock OCPP-compatible command payloads."""
    source_alerts = alerts if alerts is not None else generate_sample_alerts()
    commands: List[Dict[str, Any]] = []

    for alert in source_alerts:
        title = str(alert.get("title", "")).strip().lower()
        severity = str(alert.get("severity", "")).strip().lower()
        related_ev_id = alert.get("related_session_id")
        related_charger_id = alert.get("related_charger_id")

        if "abnormal power request" in title:
            target_ev_id = str(related_ev_id) if related_ev_id else "EV_999"
            # The demo story anchors this threat flow to EV_999 / CHG_09.
            target_charger_id = "CHG_09"
            if severity == "high":
                commands.append(
                    _build_command(
                        charger_id=target_charger_id,
                        related_ev_id=target_ev_id,
                        command="RemoteStopTransaction",
                        reason="High-severity abnormal power request detected",
                    )
                )
            else:
                commands.append(
                    _build_command(
                        charger_id=target_charger_id,
                        related_ev_id=target_ev_id,
                        command="SetChargingProfile",
                        max_current_amp=10,
                        reason="Cap current due to abnormal power request",
                    )
                )
            continue

        if "charger offline" in title:
            charger_id = str(related_charger_id) if related_charger_id else "CHG_UNKNOWN"
            if severity == "high":
                commands.append(
                    _build_command(
                        charger_id=charger_id,
                        command="ExcludeFromAllocation",
                        reason="Exclude charger from allocation while offline",
                    )
                )
            else:
                commands.append(
                    _build_command(
                        charger_id=charger_id,
                        command="InspectCharger",
                        reason="Inspect charger after offline warning",
                    )
                )
            continue

        if "repeated session" in title:
            ev_id = str(related_ev_id) if related_ev_id else None
            charger_id = (
                str(related_charger_id)
                if related_charger_id
                else _charger_id_from_ev(ev_id)
            )
            commands.append(
                _build_command(
                    charger_id=charger_id,
                    related_ev_id=ev_id,
                    command="RequireSessionReview",
                    reason="Repeated session pattern requires manual review",
                )
            )

    return commands
