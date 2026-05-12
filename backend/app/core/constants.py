"""Shared constants for VerdeWatt backend MVP."""

from __future__ import annotations

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = PROJECT_ROOT / "data"
LOAD_CSV_PATH = DATA_DIR / "synthetic_building_load.csv"
SESSIONS_JSON_PATH = DATA_DIR / "ev_sessions_sample.json"

# Rule-based security thresholds and mock telemetry.
SAFE_MAX_CHARGING_KW = 22.0
MOCK_CHARGER_HEALTH = [
    {"charger_id": "CHG-A1", "offline": False, "failed_pings": 1},
    {"charger_id": "CHG-B2", "offline": True, "failed_pings": 6},
    {"charger_id": "CHG-C3", "offline": False, "failed_pings": 5},
]

# Tariff assumptions (VND/kWh).
PEAK_TARIFF_VND_PER_KWH = 3500
OFFPEAK_TARIFF_VND_PER_KWH = 1800
INCENTIVE_VND_PER_SHIFTED_KWH = 500
PEAK_HOURS = {18, 19, 20, 21, 22}

# Impact assumptions.
VIETNAM_GRID_EMISSION_FACTOR_KG_CO2_PER_KWH = 0.4715
TREE_CO2_ABSORPTION_KG_PER_YEAR = 21.77
PETROL_CO2_KG_PER_LITER = 2.31

# Supported schedule preferences.
ALLOWED_SCHEDULE_PREFERENCES = {"cheapest", "fastest", "balanced"}
