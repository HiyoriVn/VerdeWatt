"""Rule-based smart charging scheduler for VerdeWatt MVP.

This module converts optimizer allocations into practical per-vehicle
recommendations for dashboard and vehicle lookup views.
"""

from __future__ import annotations

from datetime import datetime
import json
from typing import Any, Dict, List

from ai.optimizer import run_optimizer
from backend.app.core.constants import (
    ALLOWED_SCHEDULE_PREFERENCES,
    LOAD_CSV_PATH,
    OFFPEAK_TARIFF_VND_PER_KWH,
    PEAK_HOURS,
    PEAK_TARIFF_VND_PER_KWH,
    SESSIONS_JSON_PATH,
)


def _load_sessions() -> List[Dict[str, Any]]:
    """Load EV sessions from sample JSON."""
    with SESSIONS_JSON_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def _is_offpeak(hour: int) -> bool:
    """Simple tariff split: all non-peak hours are treated as off-peak."""
    return hour not in PEAK_HOURS


def _required_kwh(session: Dict[str, Any]) -> float:
    """Estimate required energy based on SOC gap and battery size."""
    soc_gap = max(0.0, float(session.get("target_soc", 0)) - float(session.get("current_soc", 0)))
    return float(session.get("battery_kwh", 0.0)) * soc_gap / 100.0


def _build_allocation_map(hourly_allocations: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """Group optimizer allocations by EV id."""
    allocation_map: Dict[str, List[Dict[str, Any]]] = {}

    for item in hourly_allocations:
        ev_id = str(item.get("ev_id", ""))
        if not ev_id:
            continue

        allocation_map.setdefault(ev_id, []).append(item)

    for ev_id, items in allocation_map.items():
        items.sort(key=lambda x: int(x.get("hour", 0)))

    return allocation_map


def _normalize_preference(preference: str) -> str:
    """Fallback to balanced when unsupported preference is sent."""
    value = str(preference or "").lower()
    return value if value in ALLOWED_SCHEDULE_PREFERENCES else "balanced"


def _choose_start_hour(
    session: Dict[str, Any],
    allocated_hours: List[int],
    preference: str,
) -> int | None:
    """Pick a practical recommended start hour from safe allocated slots."""
    if not allocated_hours:
        return None

    earliest_hour = min(allocated_hours)
    offpeak_hours = [h for h in allocated_hours if _is_offpeak(h)]
    priority = str(session.get("priority", "")).lower()

    def offpeak_near_23(hours: List[int]) -> int | None:
        """Prefer an off-peak hour around 23:00 for flexible charging."""
        if not hours:
            return None

        def distance_to_23(hour: int) -> int:
            # Circular clock distance on 24h format.
            return min((hour - 23) % 24, (23 - hour) % 24)

        return min(hours, key=lambda h: (distance_to_23(h), h))

    if preference == "fastest":
        return earliest_hour

    if preference == "cheapest":
        # Urgent EVs should still start as early as possible when safe.
        if priority == "urgent":
            return earliest_hour

        if priority == "flexible":
            near_23 = offpeak_near_23(offpeak_hours)
            return near_23 if near_23 is not None else earliest_hour

        return min(offpeak_hours) if offpeak_hours else earliest_hour

    # Balanced: protect urgency but still use off-peak for flexible sessions.
    if priority == "urgent":
        return earliest_hour

    if priority == "flexible" and offpeak_hours:
        near_23 = offpeak_near_23(offpeak_hours)
        return near_23 if near_23 is not None else earliest_hour

    return earliest_hour


def _estimate_cost_and_saving(
    required_kwh: float,
    ev_allocations: List[Dict[str, Any]],
) -> tuple[float, float]:
    """Estimate per-EV managed cost and savings using simple tariffs."""
    estimated_cost_vnd = 0.0

    for item in ev_allocations:
        hour = int(item.get("hour", 0))
        allocated_kwh = float(item.get("allocated_kw", 0.0))
        tariff = OFFPEAK_TARIFF_VND_PER_KWH if _is_offpeak(hour) else PEAK_TARIFF_VND_PER_KWH
        estimated_cost_vnd += allocated_kwh * tariff

    # Baseline assumption: unmanaged charging pays peak tariff for required energy.
    baseline_cost_vnd = required_kwh * PEAK_TARIFF_VND_PER_KWH
    estimated_saving_vnd = max(0.0, baseline_cost_vnd - estimated_cost_vnd)

    return estimated_cost_vnd, estimated_saving_vnd


def _build_status_and_messages(
    session: Dict[str, Any],
    preference: str,
    suspicious: bool,
    fully_served: bool,
    scheduled_start_hour: int | None,
    estimated_completion_hour: int | None,
    estimated_saving_vnd: float,
) -> tuple[str, str, str]:
    """Return status, recommended_action, and user_message."""
    priority = str(session.get("priority", "")).lower()
    deadline_hour = int(session.get("deadline_hour", 23))
    current_hour = datetime.now().hour

    if suspicious:
        return (
            "needs_attention",
            "Pause auto-charging and verify this session manually before continuing.",
            "This vehicle has suspicious behavior and needs manual review for safety.",
        )

    if fully_served:
        return (
            "completed",
            "Charging goal is already satisfied by the current safe schedule.",
            "Your charging target has been met for today.",
        )

    if scheduled_start_hour is None:
        return (
            "delayed_for_safety",
            "Delay charging for now and re-check available safe capacity in the next cycle.",
            "Charging is temporarily delayed to keep total building load within safe limits.",
        )

    if estimated_completion_hour is not None and estimated_completion_hour > deadline_hour:
        return (
            "delayed_for_safety",
            "Current safe plan may miss the deadline. Increase priority or reduce other load.",
            "Your vehicle is delayed due to safety constraints and may finish after the deadline.",
        )

    if priority == "flexible" and _is_offpeak(scheduled_start_hour):
        return (
            "scheduled_offpeak",
            f"Start at {scheduled_start_hour:02d}:00 to use lower tariff off-peak energy.",
            f"Your session is shifted to off-peak hours to reduce cost (estimated saving {estimated_saving_vnd:,.0f} VND).",
        )

    if preference == "cheapest" and _is_offpeak(scheduled_start_hour):
        return (
            "scheduled_offpeak",
            f"Start at {scheduled_start_hour:02d}:00 for lower-cost charging.",
            f"Cheapest mode selected: charging is scheduled for off-peak tariff where possible.",
        )

    if scheduled_start_hour <= current_hour:
        return (
            "charging_now",
            "Charge now in the earliest safe slot to protect deadline reliability.",
            "Charging can start now while staying under safe building capacity.",
        )

    return (
        "charging_now",
        f"Prepare to charge at {scheduled_start_hour:02d}:00 in the next safe slot.",
        "Charging is scheduled soon based on safety and deadline constraints.",
    )


def generate_schedule_recommendations(preference: str = "balanced") -> List[Dict[str, Any]]:
    """Generate per-EV schedule recommendations from sessions + optimizer output."""
    selected_preference = _normalize_preference(preference)

    sessions = _load_sessions()
    optimizer_result = run_optimizer(
        building_load_path=LOAD_CSV_PATH,
        ev_sessions_path=SESSIONS_JSON_PATH,
    )

    hourly_allocations = optimizer_result.get("hourly_allocations", [])
    allocation_map = _build_allocation_map(hourly_allocations)
    fully_served_set = set(optimizer_result.get("evs_fully_served", []))

    recommendations: List[Dict[str, Any]] = []

    for session in sessions:
        vehicle_id = str(session.get("id", "UNKNOWN"))
        ev_allocations = allocation_map.get(vehicle_id, [])
        allocated_hours = [int(item.get("hour", 0)) for item in ev_allocations]

        scheduled_start_hour = _choose_start_hour(session, allocated_hours, selected_preference)
        estimated_completion_hour = max(allocated_hours) if allocated_hours else None

        req_kwh = _required_kwh(session)
        est_cost_vnd, est_saving_vnd = _estimate_cost_and_saving(req_kwh, ev_allocations)

        suspicious_flag = bool(session.get("suspicious", False)) or vehicle_id.upper().endswith("999")
        fully_served = vehicle_id in fully_served_set

        status, recommended_action, user_message = _build_status_and_messages(
            session=session,
            preference=selected_preference,
            suspicious=suspicious_flag,
            fully_served=fully_served,
            scheduled_start_hour=scheduled_start_hour,
            estimated_completion_hour=estimated_completion_hour,
            estimated_saving_vnd=est_saving_vnd,
        )

        recommendations.append(
            {
                "vehicle_id": vehicle_id,
                "current_soc": float(session.get("current_soc", 0.0)),
                "target_soc": float(session.get("target_soc", 0.0)),
                "priority": str(session.get("priority", "normal")).lower(),
                "status": status,
                "recommended_action": recommended_action,
                "scheduled_start_hour": scheduled_start_hour,
                "estimated_completion_hour": estimated_completion_hour,
                "estimated_cost_vnd": round(est_cost_vnd, 2),
                "estimated_saving_vnd": round(est_saving_vnd, 2),
                "user_message": user_message,
            }
        )

    return recommendations
