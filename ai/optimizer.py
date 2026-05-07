"""Rule-based EV charging optimizer for VerdeWatt.

This module allocates EV charging power hour-by-hour so that total building
load stays within safe capacity.
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any, Dict, List


# Priority ranking used by the greedy scheduler (lower rank = higher priority).
PRIORITY_RANK = {
    "urgent": 0,
    "normal": 1,
    "flexible": 2,
}


def _project_root() -> Path:
    """Return the project root based on this file location."""
    return Path(__file__).resolve().parent.parent


def load_building_load(csv_path: Path) -> List[Dict[str, float]]:
    """Load hourly building load records from CSV."""
    rows: List[Dict[str, float]] = []

    with csv_path.open("r", encoding="utf-8") as f:
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

    # Keep rows in chronological order even if file order changes.
    rows.sort(key=lambda x: x["hour"])
    return rows


def load_ev_sessions(json_path: Path) -> List[Dict[str, Any]]:
    """Load EV sessions and compute each EV's required energy (kWh)."""
    with json_path.open("r", encoding="utf-8") as f:
        sessions = json.load(f)

    prepared: List[Dict[str, Any]] = []
    for session in sessions:
        soc_gap = max(0.0, float(session["target_soc"]) - float(session["current_soc"]))
        required_kwh = float(session["battery_kwh"]) * soc_gap / 100.0

        prepared.append(
            {
                "id": str(session["id"]),
                "current_soc": float(session["current_soc"]),
                "target_soc": float(session["target_soc"]),
                "battery_kwh": float(session["battery_kwh"]),
                "deadline_hour": int(session["deadline_hour"]),
                "priority": str(session["priority"]).lower(),
                "max_charging_kw": float(session["max_charging_kw"]),
                "required_kwh": required_kwh,
                "remaining_kwh": required_kwh,
            }
        )

    return prepared


def optimize_charging(
    building_load: List[Dict[str, float]],
    ev_sessions: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Allocate EV charging power with a greedy priority queue by hour.

    Rules:
    - Spare capacity each hour = safe_capacity_kw - base_load_kw
    - Sort EVs by priority (urgent > normal > flexible), then earliest deadline
    - Never allocate more than spare capacity or EV max charging power
    """
    hourly_allocations: List[Dict[str, Any]] = []
    total_load_after_optimization: List[Dict[str, float]] = []

    for row in building_load:
        hour = int(row["hour"])
        base_load_kw = float(row["base_load_kw"])
        safe_capacity_kw = float(row["safe_capacity_kw"])

        spare_capacity_kw = max(0.0, safe_capacity_kw - base_load_kw)
        remaining_capacity_kw = spare_capacity_kw

        # Eligible EVs: still need energy and deadline has not passed.
        # We treat deadline_hour as inclusive for this 1-hour time slot model.
        eligible = [
            ev
            for ev in ev_sessions
            if ev["remaining_kwh"] > 0 and hour <= ev["deadline_hour"]
        ]

        eligible.sort(
            key=lambda ev: (
                PRIORITY_RANK.get(ev["priority"], 99),
                ev["deadline_hour"],
            )
        )

        allocated_this_hour = 0.0

        for ev in eligible:
            if remaining_capacity_kw <= 0:
                break

            # 1 hour slot: kW allocated for this hour equals kWh delivered.
            allocation_kw = min(
                ev["max_charging_kw"],
                ev["remaining_kwh"],
                remaining_capacity_kw,
            )

            if allocation_kw <= 0:
                continue

            ev["remaining_kwh"] -= allocation_kw
            remaining_capacity_kw -= allocation_kw
            allocated_this_hour += allocation_kw

            hourly_allocations.append(
                {
                    "hour": hour,
                    "ev_id": ev["id"],
                    "allocated_kw": round(allocation_kw, 2),
                }
            )

        total_load_after_optimization.append(
            {
                "hour": hour,
                "total_load_kw": round(base_load_kw + allocated_this_hour, 2),
            }
        )

    before_loads = [
        row["base_load_kw"] + row["unmanaged_ev_load_kw"] for row in building_load
    ]
    after_loads = [row["total_load_kw"] for row in total_load_after_optimization]

    # Check that optimized load never exceeds safe capacity for each hour.
    safe_capacity_by_hour = {
        row["hour"]: row["safe_capacity_kw"] for row in building_load
    }
    peak_after_under_safe_capacity_kw = True
    for row in total_load_after_optimization:
        safe_capacity_kw = safe_capacity_by_hour.get(row["hour"], 0.0)
        if row["total_load_kw"] > safe_capacity_kw + 1e-6:
            peak_after_under_safe_capacity_kw = False
            break

    peak_before_kw = max(before_loads) if before_loads else 0.0
    peak_after_kw = max(after_loads) if after_loads else 0.0
    peak_reduction_kw = peak_before_kw - peak_after_kw
    peak_reduction_percent = (
        (peak_reduction_kw / peak_before_kw) * 100 if peak_before_kw > 0 else 0.0
    )

    evs_fully_served = [
        ev["id"] for ev in ev_sessions if ev["remaining_kwh"] <= 1e-6
    ]
    evs_partially_served = [
        ev["id"]
        for ev in ev_sessions
        if ev["required_kwh"] > 0 and ev["remaining_kwh"] > 1e-6
    ]

    return {
        "hourly_allocations": hourly_allocations,
        "total_load_after_optimization": total_load_after_optimization,
        "peak_before_kw": round(peak_before_kw, 2),
        "peak_after_kw": round(peak_after_kw, 2),
        "peak_reduction_kw": round(peak_reduction_kw, 2),
        "peak_reduction_percent": round(peak_reduction_percent, 2),
        "evs_fully_served": evs_fully_served,
        "evs_partially_served": evs_partially_served,
        "peak_after_under_safe_capacity_kw": peak_after_under_safe_capacity_kw,
    }


def run_optimizer(
    building_load_path: Path | None = None,
    ev_sessions_path: Path | None = None,
) -> Dict[str, Any]:
    """Convenience function to run optimization from file paths."""
    root = _project_root()
    building_path = building_load_path or (root / "data" / "synthetic_building_load.csv")
    sessions_path = ev_sessions_path or (root / "data" / "ev_sessions_sample.json")

    building_load = load_building_load(building_path)
    ev_sessions = load_ev_sessions(sessions_path)

    return optimize_charging(building_load, ev_sessions)


def print_summary(result: Dict[str, Any], show_allocations: bool = False) -> None:
    """Print a beginner-friendly CLI validation summary."""
    print("VerdeWatt Optimizer Validation Summary")
    print("=" * 39)
    print(f"peak_before_kw: {result['peak_before_kw']:.2f} kW")
    print(f"peak_after_kw: {result['peak_after_kw']:.2f} kW")
    print(f"peak_reduction_kw: {result['peak_reduction_kw']:.2f} kW")
    print(f"peak_reduction_percent: {result['peak_reduction_percent']:.2f}%")

    fully = result["evs_fully_served"]
    partial = result["evs_partially_served"]

    fully_label = ", ".join(fully) if fully else "None"
    partial_label = ", ".join(partial) if partial else "None"

    print(f"evs_fully_served: {fully_label}")
    print(f"evs_partially_served: {partial_label}")

    safe_label = "yes" if result["peak_after_under_safe_capacity_kw"] else "no"
    print(f"peak_after_under_safe_capacity_kw: {safe_label}")

    if show_allocations:
        print()
        print("First 15 hourly allocations (hour, ev_id, allocated_kw):")
        for item in result["hourly_allocations"][:15]:
            print(
                f"- {item['hour']:02d}:00 | {item['ev_id']} | {item['allocated_kw']:.2f} kW"
            )


def main() -> None:
    """CLI entrypoint for quick local testing."""
    parser = argparse.ArgumentParser(
        description="Run the rule-based EV charging optimizer."
    )
    parser.add_argument(
        "--show-allocations",
        action="store_true",
        help="Print a short list of hourly allocations.",
    )
    args = parser.parse_args()

    result = run_optimizer()
    print_summary(result, show_allocations=args.show_allocations)


if __name__ == "__main__":
    main()
