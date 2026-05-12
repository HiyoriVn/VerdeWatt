"""User-facing scheduling service wrappers for VerdeWatt MVP."""

from __future__ import annotations

import csv
import math
from datetime import datetime
from typing import Any, Dict, List

from backend.app.core.constants import (
    ALLOWED_SCHEDULE_PREFERENCES,
    LOAD_CSV_PATH,
    OFFPEAK_TARIFF_VND_PER_KWH,
    PEAK_HOURS,
    PEAK_TARIFF_VND_PER_KWH,
)
from backend.app.services.scheduler import (
    generate_schedule_recommendations as _generate_schedule_recommendations,
)


def generate_schedule_recommendations(preference: str = "balanced") -> List[Dict[str, Any]]:
    """Return existing per-vehicle schedule recommendations for dashboard use."""
    return _generate_schedule_recommendations(preference=preference)


def _normalize_preference(preference: str) -> str:
    value = str(preference or "").strip().lower()
    return value if value in ALLOWED_SCHEDULE_PREFERENCES else "balanced"


def _is_offpeak(hour: int) -> bool:
    return hour not in PEAK_HOURS


def _hours_until(target_hour: int, from_hour: int) -> int:
    delta = (target_hour - from_hour) % 24
    return 24 if delta == 0 else delta


def _load_safe_hours() -> Dict[int, float]:
    """Read per-hour spare capacity (safe - base) from synthetic load profile."""
    safe_hours: Dict[int, float] = {}

    with LOAD_CSV_PATH.open("r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            hour = int(row["hour"])
            base_load_kw = float(row["base_load_kw"])
            safe_capacity_kw = float(row["safe_capacity_kw"])
            spare_capacity_kw = safe_capacity_kw - base_load_kw
            if spare_capacity_kw > 0:
                safe_hours[hour] = spare_capacity_kw

    return safe_hours


def _choose_charging_power_kw(preference: str, urgent_deadline: bool) -> float:
    if preference == "fastest":
        return 11.0
    if preference == "cheapest":
        return 7.0
    if urgent_deadline:
        return 11.0
    return 9.0


def _nearest_to_23(hours: List[int]) -> int | None:
    if not hours:
        return None

    def distance(hour: int) -> int:
        return min((hour - 23) % 24, (23 - hour) % 24)

    return min(hours, key=lambda hour: (distance(hour), hour))


def _meets_deadline(
    *,
    start_hour: int,
    duration_hours: int,
    current_hour: int,
    deadline_hour: int,
) -> bool:
    deadline_offset = _hours_until(deadline_hour, current_hour)
    start_offset = (start_hour - current_hour) % 24
    completion_offset = start_offset + duration_hours
    return completion_offset <= deadline_offset


def _pick_start_hour(
    *,
    preference: str,
    deadline_hour: int,
    duration_hours: int,
    safe_hours: Dict[int, float],
    current_hour: int,
    urgent_deadline: bool,
) -> tuple[int | None, bool]:
    if not safe_hours:
        return None, False

    all_safe_hours = list(safe_hours.keys())
    earliest_safe = min(all_safe_hours, key=lambda hour: ((hour - current_hour) % 24, hour))
    offpeak_safe = [hour for hour in all_safe_hours if _is_offpeak(hour)]
    near_23 = _nearest_to_23(offpeak_safe)

    if preference == "fastest" or urgent_deadline:
        candidates = [earliest_safe, near_23]
    elif preference == "cheapest":
        candidates = [near_23, earliest_safe]
    else:
        deadline_tight = _hours_until(deadline_hour, current_hour) <= 6
        candidates = [earliest_safe, near_23] if deadline_tight else [near_23, earliest_safe]

    first_candidate: int | None = None
    for candidate in candidates:
        if candidate is None:
            continue
        if first_candidate is None:
            first_candidate = candidate
        if _meets_deadline(
            start_hour=candidate,
            duration_hours=duration_hours,
            current_hour=current_hour,
            deadline_hour=deadline_hour,
        ):
            return candidate, True

    return first_candidate, False


def _estimate_cost(
    *,
    required_kwh: float,
    start_hour: int,
    charging_power_kw: float,
    duration_hours: int,
) -> float:
    remaining_kwh = required_kwh
    estimated_cost_vnd = 0.0

    for step in range(duration_hours):
        hour = (start_hour + step) % 24
        charged_kwh = min(charging_power_kw, remaining_kwh)
        tariff = OFFPEAK_TARIFF_VND_PER_KWH if _is_offpeak(hour) else PEAK_TARIFF_VND_PER_KWH
        estimated_cost_vnd += charged_kwh * tariff
        remaining_kwh = max(0.0, remaining_kwh - charged_kwh)

        if remaining_kwh <= 0:
            break

    return estimated_cost_vnd


def create_charging_request_recommendation(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Build one beginner-friendly recommendation for a user charging request."""
    vehicle_id = str(payload.get("vehicle_id", "UNKNOWN")).strip().upper()
    current_soc = float(payload.get("current_soc", 0.0))
    target_soc = float(payload.get("target_soc", 0.0))
    battery_kwh = float(payload.get("battery_kwh", 0.0))
    deadline_hour = int(payload.get("deadline_hour", 23)) % 24
    preference = _normalize_preference(str(payload.get("preference", "balanced")))

    if vehicle_id.endswith("999"):
        return {
            "vehicle_id": vehicle_id,
            "status": "needs_attention",
            "recommended_action": "Require manual review before scheduling this vehicle.",
            "scheduled_start_hour": None,
            "estimated_completion_hour": None,
            "estimated_cost_vnd": 0,
            "estimated_saving_vnd": 0,
            "user_message": "This vehicle is flagged as suspicious and needs operator verification before charging.",
        }

    required_kwh = max(0.0, battery_kwh * max(0.0, target_soc - current_soc) / 100.0)
    if required_kwh <= 0:
        return {
            "vehicle_id": vehicle_id,
            "status": "completed",
            "recommended_action": "No additional charging is needed.",
            "scheduled_start_hour": None,
            "estimated_completion_hour": None,
            "estimated_cost_vnd": 0,
            "estimated_saving_vnd": 0,
            "user_message": "Your current state of charge already meets the target.",
        }

    current_hour = datetime.now().hour
    urgent_deadline = _hours_until(deadline_hour, current_hour) <= 6
    charging_power_kw = _choose_charging_power_kw(preference, urgent_deadline)
    duration_hours = max(1, int(math.ceil(required_kwh / max(charging_power_kw, 0.1))))

    safe_hours = _load_safe_hours()
    eligible_safe_hours = {
        hour: spare_kw
        for hour, spare_kw in safe_hours.items()
        if spare_kw >= charging_power_kw
    }

    scheduled_start_hour, meets_deadline = _pick_start_hour(
        preference=preference,
        deadline_hour=deadline_hour,
        duration_hours=duration_hours,
        safe_hours=eligible_safe_hours,
        current_hour=current_hour,
        urgent_deadline=urgent_deadline,
    )

    if scheduled_start_hour is None:
        return {
            "vehicle_id": vehicle_id,
            "status": "delayed_for_safety",
            "recommended_action": "Delay charging until safe building capacity is available.",
            "scheduled_start_hour": None,
            "estimated_completion_hour": None,
            "estimated_cost_vnd": 0,
            "estimated_saving_vnd": 0,
            "user_message": "No safe charging slot is available right now. Please try again later.",
        }

    estimated_completion_hour = (scheduled_start_hour + duration_hours) % 24
    estimated_cost_vnd = _estimate_cost(
        required_kwh=required_kwh,
        start_hour=scheduled_start_hour,
        charging_power_kw=charging_power_kw,
        duration_hours=duration_hours,
    )
    peak_baseline_vnd = required_kwh * PEAK_TARIFF_VND_PER_KWH
    estimated_saving_vnd = max(0.0, peak_baseline_vnd - estimated_cost_vnd)

    if not meets_deadline:
        status = "delayed_for_safety"
        recommended_action = "Schedule is safe but may miss deadline; consider a faster preference."
        user_message = (
            "A safe slot was found, but this plan may complete after your deadline due to building safety limits."
        )
    elif preference == "cheapest" and _is_offpeak(scheduled_start_hour):
        status = "scheduled_offpeak"
        recommended_action = "Schedule for off-peak charging"
        user_message = (
            "Your vehicle is scheduled for off-peak charging to reduce cost and avoid building overload."
        )
    elif preference == "balanced" and _is_offpeak(scheduled_start_hour) and not urgent_deadline:
        status = "scheduled_offpeak"
        recommended_action = "Use an off-peak slot that still respects your deadline."
        user_message = (
            "Your schedule balances deadline safety and charging cost by selecting an off-peak start."
        )
    else:
        status = "charging_now"
        recommended_action = "Use the earliest safe charging slot."
        user_message = "Your vehicle is scheduled in the earliest safe slot to improve completion reliability."

    return {
        "vehicle_id": vehicle_id,
        "status": status,
        "recommended_action": recommended_action,
        "scheduled_start_hour": int(scheduled_start_hour),
        "estimated_completion_hour": int(estimated_completion_hour),
        "estimated_cost_vnd": int(round(estimated_cost_vnd)),
        "estimated_saving_vnd": int(round(estimated_saving_vnd)),
        "user_message": user_message,
    }


__all__ = [
    "create_charging_request_recommendation",
    "generate_schedule_recommendations",
]
