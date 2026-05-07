"""Rule-based billing and impact KPI simulation for VerdeWatt MVP."""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Any, Dict, List

from ai.optimizer import run_optimizer


PROJECT_ROOT = Path(__file__).resolve().parents[3]
LOAD_CSV_PATH = PROJECT_ROOT / "data" / "synthetic_building_load.csv"
SESSIONS_JSON_PATH = PROJECT_ROOT / "data" / "ev_sessions_sample.json"

# Simple tariff assumptions (VND/kWh)
PEAK_TARIFF_VND_PER_KWH = 3500
OFFPEAK_TARIFF_VND_PER_KWH = 1800
INCENTIVE_VND_PER_SHIFTED_KWH = 500

# Peak period used for this simulation.
PEAK_HOURS = {18, 19, 20, 21, 22}


def _load_unmanaged_ev_profile() -> Dict[int, float]:
    """Read unmanaged EV load by hour from CSV."""
    profile: Dict[int, float] = {}

    with LOAD_CSV_PATH.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            hour = int(row["hour"])
            unmanaged_ev_load_kw = float(row["unmanaged_ev_load_kw"])
            profile[hour] = unmanaged_ev_load_kw

    return profile


def _aggregate_allocations_by_hour(hourly_allocations: List[Dict[str, Any]]) -> Dict[int, float]:
    """Convert per-EV allocation rows into total managed EV energy per hour."""
    managed_by_hour: Dict[int, float] = {}

    for item in hourly_allocations:
        hour = int(item.get("hour", 0))
        allocated_kw = float(item.get("allocated_kw", 0.0))
        managed_by_hour[hour] = managed_by_hour.get(hour, 0.0) + allocated_kw

    return managed_by_hour


def simulate_billing_kpis(
    hourly_allocations: List[Dict[str, Any]] | None = None,
) -> Dict[str, Any]:
    """Calculate billing and impact KPIs from optimizer output or provided allocations.

    If `hourly_allocations` is not provided, this function runs the optimizer first.
    """
    if hourly_allocations is None:
        optimizer_result = run_optimizer(
            building_load_path=LOAD_CSV_PATH,
            ev_sessions_path=SESSIONS_JSON_PATH,
        )
        hourly_allocations = optimizer_result.get("hourly_allocations", [])
    else:
        optimizer_result = None

    unmanaged_profile = _load_unmanaged_ev_profile()
    managed_by_hour = _aggregate_allocations_by_hour(hourly_allocations)

    total_kwh = sum(managed_by_hour.values())
    peak_kwh = sum(kwh for hour, kwh in managed_by_hour.items() if hour in PEAK_HOURS)
    offpeak_kwh = total_kwh - peak_kwh

    unmanaged_peak_kwh = sum(
        kwh for hour, kwh in unmanaged_profile.items() if hour in PEAK_HOURS
    )

    # "Shifted" means EV energy avoided from peak-time charging.
    shifted_kwh = max(0.0, unmanaged_peak_kwh - peak_kwh)

    estimated_cost_vnd = peak_kwh * PEAK_TARIFF_VND_PER_KWH + offpeak_kwh * OFFPEAK_TARIFF_VND_PER_KWH
    estimated_saving_vnd = shifted_kwh * (PEAK_TARIFF_VND_PER_KWH - OFFPEAK_TARIFF_VND_PER_KWH)
    incentive_value_vnd = shifted_kwh * INCENTIVE_VND_PER_SHIFTED_KWH

    response: Dict[str, Any] = {
        "total_kwh": round(total_kwh, 2),
        "peak_kwh": round(peak_kwh, 2),
        "offpeak_kwh": round(offpeak_kwh, 2),
        "shifted_kwh": round(shifted_kwh, 2),
        "estimated_cost_vnd": round(estimated_cost_vnd, 2),
        "estimated_saving_vnd": round(estimated_saving_vnd, 2),
        "incentive_value_vnd": round(incentive_value_vnd, 2),
        "assumptions": {
            "peak_tariff_vnd_per_kwh": PEAK_TARIFF_VND_PER_KWH,
            "offpeak_tariff_vnd_per_kwh": OFFPEAK_TARIFF_VND_PER_KWH,
            "incentive_vnd_per_shifted_kwh": INCENTIVE_VND_PER_SHIFTED_KWH,
            "peak_hours": sorted(list(PEAK_HOURS)),
        },
    }

    if optimizer_result is not None:
        response["optimizer_summary"] = {
            "peak_before_kw": optimizer_result.get("peak_before_kw"),
            "peak_after_kw": optimizer_result.get("peak_after_kw"),
            "peak_reduction_kw": optimizer_result.get("peak_reduction_kw"),
            "peak_reduction_percent": optimizer_result.get("peak_reduction_percent"),
        }

    return response
