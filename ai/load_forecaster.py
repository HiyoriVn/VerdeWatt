"""Lightweight load forecasting module for VerdeWatt MVP.

This module trains a simple RandomForestRegressor on augmented synthetic data
and forecasts base building load for the next 6 hours.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Tuple

import numpy as np
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATA_PATH = PROJECT_ROOT / "data" / "synthetic_building_load.csv"

PEAK_HOURS = {18, 19, 20, 21, 22}
FORECAST_HORIZON_HOURS = 6

FEATURE_COLUMNS = [
    "hour",
    "sin_hour",
    "cos_hour",
    "is_peak_hour",
    "previous_1h_load",
    "previous_2h_load",
    "previous_3h_load",
    "unmanaged_ev_load_kw",
]


def load_base_profile(csv_path: Path = DEFAULT_DATA_PATH) -> pd.DataFrame:
    """Load and sort the 24-hour synthetic building profile."""
    df = pd.read_csv(csv_path)
    df = df.sort_values("hour").reset_index(drop=True)
    return df


def augment_days(
    base_df: pd.DataFrame,
    num_days: int = 60,
    noise_std_kw: float = 1.8,
    random_seed: int = 42,
) -> pd.DataFrame:
    """Create multiple synthetic days by adding small random noise."""
    rng = np.random.default_rng(random_seed)
    days: List[pd.DataFrame] = []

    for day_idx in range(num_days):
        day_df = base_df.copy()

        # Small noise around existing pattern for MVP training stability.
        day_df["base_load_kw"] = (
            day_df["base_load_kw"] + rng.normal(0, noise_std_kw, len(day_df))
        )
        day_df["unmanaged_ev_load_kw"] = (
            day_df["unmanaged_ev_load_kw"] + rng.normal(0, noise_std_kw * 0.7, len(day_df))
        )

        day_df["base_load_kw"] = day_df["base_load_kw"].clip(lower=0)
        day_df["unmanaged_ev_load_kw"] = day_df["unmanaged_ev_load_kw"].clip(lower=0)

        day_df["day_index"] = day_idx
        days.append(day_df)

    augmented = pd.concat(days, ignore_index=True)
    return augmented


def build_training_features(augmented_df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """Build supervised learning features and target series."""
    df = augmented_df.copy()

    # Time-based features.
    df["sin_hour"] = np.sin(2 * np.pi * df["hour"] / 24)
    df["cos_hour"] = np.cos(2 * np.pi * df["hour"] / 24)
    df["is_peak_hour"] = df["hour"].isin(PEAK_HOURS).astype(int)

    # Lag features from sequential base load values.
    df["previous_1h_load"] = df["base_load_kw"].shift(1)
    df["previous_2h_load"] = df["base_load_kw"].shift(2)
    df["previous_3h_load"] = df["base_load_kw"].shift(3)

    # Drop first rows where lag features are missing.
    df = df.dropna().reset_index(drop=True)

    X = df[FEATURE_COLUMNS]
    y = df["base_load_kw"]
    return X, y


def train_forecast_model(
    csv_path: Path = DEFAULT_DATA_PATH,
) -> Tuple[Any, pd.DataFrame]:
    """Train a lightweight RandomForest model on augmented synthetic data."""
    try:
        from sklearn.ensemble import RandomForestRegressor
    except ModuleNotFoundError as exc:
        raise ModuleNotFoundError(
            "scikit-learn is required for forecasting. Install with: "
            "pip install -r backend/requirements.txt"
        ) from exc

    base_df = load_base_profile(csv_path)
    augmented_df = augment_days(base_df)
    X_train, y_train = build_training_features(augmented_df)

    model = RandomForestRegressor(
        n_estimators=180,
        max_depth=10,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    return model, base_df


def predict_next_6_hours(
    model: Any,
    base_df: pd.DataFrame,
    horizon_hours: int = FORECAST_HORIZON_HOURS,
) -> List[Dict[str, Any]]:
    """Forecast the next N hours using recursive lag updates."""
    unmanaged_by_hour = {
        int(row["hour"]): float(row["unmanaged_ev_load_kw"]) for _, row in base_df.iterrows()
    }

    # Use latest known loads as initial lag history.
    history_loads = base_df["base_load_kw"].astype(float).tolist()
    last_known_hour = int(base_df["hour"].iloc[-1])

    predictions: List[Dict[str, Any]] = []

    for step in range(1, horizon_hours + 1):
        forecast_hour = (last_known_hour + step) % 24

        feature_row = {
            "hour": float(forecast_hour),
            "sin_hour": float(np.sin(2 * np.pi * forecast_hour / 24)),
            "cos_hour": float(np.cos(2 * np.pi * forecast_hour / 24)),
            "is_peak_hour": 1.0 if forecast_hour in PEAK_HOURS else 0.0,
            "previous_1h_load": float(history_loads[-1]),
            "previous_2h_load": float(history_loads[-2]),
            "previous_3h_load": float(history_loads[-3]),
            "unmanaged_ev_load_kw": float(unmanaged_by_hour.get(forecast_hour, 0.0)),
        }

        X_next = pd.DataFrame([feature_row], columns=FEATURE_COLUMNS)
        predicted_load = float(model.predict(X_next)[0])
        predicted_load = max(0.0, predicted_load)

        history_loads.append(predicted_load)

        predictions.append(
            {
                "hour": int(forecast_hour),
                "predicted_base_load_kw": round(predicted_load, 2),
                "is_peak_hour": forecast_hour in PEAK_HOURS,
            }
        )

    return predictions


def get_feature_importance(model: Any) -> List[Dict[str, Any]]:
    """Return a sorted feature importance list."""
    feature_rows = []
    for feature, importance in zip(FEATURE_COLUMNS, model.feature_importances_):
        feature_rows.append(
            {
                "feature": feature,
                "importance": round(float(importance), 4),
            }
        )

    feature_rows.sort(key=lambda x: x["importance"], reverse=True)
    return feature_rows


def generate_forecast_response(
    csv_path: Path = DEFAULT_DATA_PATH,
    horizon_hours: int = FORECAST_HORIZON_HOURS,
) -> Dict[str, Any]:
    """Train model and return MVP forecast response payload."""
    model, base_df = train_forecast_model(csv_path)
    predictions = predict_next_6_hours(model, base_df, horizon_hours=horizon_hours)
    feature_importance = get_feature_importance(model)

    return {
        "model": "RandomForestRegressor",
        "forecast_horizon_hours": horizon_hours,
        "predictions": predictions,
        "feature_importance": feature_importance,
        "note": "MVP forecast trained on augmented synthetic data for prototype demonstration.",
    }


def print_cli_summary(response: Dict[str, Any]) -> None:
    """Print beginner-friendly CLI output."""
    print("VerdeWatt Load Forecast (RandomForestRegressor)")
    print("=" * 46)
    print()
    print("Next 6 Forecasted Hours")
    print("-" * 24)
    for row in response["predictions"]:
        peak_label = "peak" if row["is_peak_hour"] else "off-peak"
        print(
            f"Hour {row['hour']:02d}:00 | predicted_base_load_kw = "
            f"{row['predicted_base_load_kw']:.2f} kW | {peak_label}"
        )

    print()
    print("Feature Importance")
    print("-" * 18)
    for item in response["feature_importance"]:
        print(f"{item['feature']:<20} {item['importance']:.4f}")


def main() -> None:
    """CLI entrypoint: python ai/load_forecaster.py"""
    try:
        response = generate_forecast_response()
    except ModuleNotFoundError as exc:
        print(str(exc))
        return

    print_cli_summary(response)


if __name__ == "__main__":
    main()
