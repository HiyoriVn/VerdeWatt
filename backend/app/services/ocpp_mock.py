"""Mock OCPP-compatible charger command generator for VerdeWatt MVP.

This module does NOT implement real OCPP communication. It only returns
simple command payloads that frontend/demo logic can display.
"""

from __future__ import annotations

from typing import Any, Dict, List

from backend.app.services.anomaly_detector import generate_sample_alerts
from backend.app.services.scheduler import generate_schedule_recommendations


def _charger_id_for_vehicle(vehicle_id: str) -> str:
    """Map vehicle IDs like EV_001 to mock charger IDs like CHG_01."""
    suffix = "".join(ch for ch in vehicle_id if ch.isdigit())
    if not suffix:
        return "CHG_00"
    return f"CHG_{int(suffix) % 100:02d}"


def _suspicious_ev_ids(alerts: List[Dict[str, Any]]) -> set[str]:
    """Collect EV IDs that look suspicious from security alerts."""
    suspicious: set[str] = set()

    for alert in alerts:
        related_session_id = alert.get("related_session_id")
        title = str(alert.get("title", "")).lower()

        if related_session_id and (
            "abnormal power" in title or "suspicious" in title
        ):
            suspicious.add(str(related_session_id))

    return suspicious


def generate_mock_charger_commands(preference: str = "balanced") -> List[Dict[str, Any]]:
    """Generate mock OCPP-style charger commands from scheduler + alerts."""
    schedule_items = generate_schedule_recommendations(preference=preference)
    alerts = generate_sample_alerts()
    suspicious_evs = _suspicious_ev_ids(alerts)

    commands: List[Dict[str, Any]] = []

    for item in schedule_items:
        vehicle_id = str(item.get("vehicle_id", "UNKNOWN"))
        priority = str(item.get("priority", "normal")).lower()
        status = str(item.get("status", "charging_now"))
        charger_id = _charger_id_for_vehicle(vehicle_id)

        if vehicle_id in suspicious_evs or vehicle_id.upper().endswith("999"):
            commands.append(
                {
                    "charger_id": charger_id,
                    "related_ev_id": vehicle_id,
                    "command": "RemoteStopTransaction",
                    "reason": "Abnormal power request detected",
                }
            )
            continue

        if status == "completed":
            commands.append(
                {
                    "charger_id": charger_id,
                    "related_ev_id": vehicle_id,
                    "command": "SetChargingProfile",
                    "max_current_amp": 0,
                    "reason": "Charging target already completed",
                }
            )
            continue

        if status == "delayed_for_safety":
            commands.append(
                {
                    "charger_id": charger_id,
                    "related_ev_id": vehicle_id,
                    "command": "SetChargingProfile",
                    "max_current_amp": 6,
                    "reason": "Building load near safe capacity",
                }
            )
            continue

        if priority == "flexible" or status == "scheduled_offpeak":
            start_hour = item.get("scheduled_start_hour")
            commands.append(
                {
                    "charger_id": charger_id,
                    "related_ev_id": vehicle_id,
                    "command": "SetChargingProfile",
                    "max_current_amp": 8,
                    "reason": (
                        "Flexible EV shifted to off-peak window"
                        if start_hour is None
                        else f"Flexible EV shifted to off-peak around {int(start_hour):02d}:00"
                    ),
                }
            )
            continue

        # Urgent/normal default: faster but still safe charging profile.
        commands.append(
            {
                "charger_id": charger_id,
                "related_ev_id": vehicle_id,
                "command": "SetChargingProfile",
                "max_current_amp": 16,
                "reason": "Building load near safe capacity",
            }
        )

    # Add charger-level commands from non-EV alerts (offline/DoS-like).
    for alert in alerts:
        related_charger_id = alert.get("related_charger_id")
        title = str(alert.get("title", "")).lower()

        if not related_charger_id:
            continue

        if "offline" in title:
            commands.append(
                {
                    "charger_id": related_charger_id,
                    "related_ev_id": None,
                    "command": "CapPowerAndVerify",
                    "reason": "Charger offline detected, verify network/device status",
                }
            )
        elif "dos-like" in title:
            commands.append(
                {
                    "charger_id": related_charger_id,
                    "related_ev_id": None,
                    "command": "CapPowerAndVerify",
                    "reason": "High failed ping rate detected",
                }
            )

    return commands
