"""Green Impact Estimator for VerdeWatt MVP.

This module converts shifted charging energy into simple environmental impact
indicators for demo and presentation usage.
"""

from __future__ import annotations

from typing import Any, Dict

from backend.app.services.billing_engine import simulate_billing_kpis


VIETNAM_GRID_EMISSION_FACTOR_KG_CO2_PER_KWH = 0.4715
TREE_CO2_ABSORPTION_KG_PER_YEAR = 21.77
PETROL_CO2_KG_PER_LITER = 2.31


def generate_impact_metrics() -> Dict[str, Any]:
    """Compute impact metrics from billing simulation output."""
    billing = simulate_billing_kpis()

    shifted_kwh = float(billing.get("shifted_kwh", 0.0))
    estimated_saving_vnd = float(billing.get("estimated_saving_vnd", 0.0))

    co2_saved_kg = shifted_kwh * VIETNAM_GRID_EMISSION_FACTOR_KG_CO2_PER_KWH
    trees_equivalent = (
        co2_saved_kg / TREE_CO2_ABSORPTION_KG_PER_YEAR
        if TREE_CO2_ABSORPTION_KG_PER_YEAR > 0
        else 0.0
    )
    petrol_equivalent_liters = (
        co2_saved_kg / PETROL_CO2_KG_PER_LITER
        if PETROL_CO2_KG_PER_LITER > 0
        else 0.0
    )

    return {
        "shifted_kwh": round(shifted_kwh, 2),
        "estimated_saving_vnd": round(estimated_saving_vnd, 2),
        "co2_saved_kg": round(co2_saved_kg, 2),
        "trees_equivalent": round(trees_equivalent, 2),
        "petrol_equivalent_liters": round(petrol_equivalent_liters, 2),
        "assumptions": {
            "grid_emission_factor_kg_co2_per_kwh": VIETNAM_GRID_EMISSION_FACTOR_KG_CO2_PER_KWH,
            "tree_absorption_kg_co2_per_year": TREE_CO2_ABSORPTION_KG_PER_YEAR,
            "petrol_kg_co2_per_liter": PETROL_CO2_KG_PER_LITER,
        },
        "note": "Prototype impact estimate. Final emission factors should be verified with official sources before submission.",
    }
