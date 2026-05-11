# VerdeWatt Forecasting Spec (MVP)

## Overview

VerdeWatt uses a lightweight machine learning module to forecast building
`base_load_kw` for the next 6 hours.

Model used:

- `RandomForestRegressor` (scikit-learn)

Endpoint:

- `GET /api/forecast`

CLI:

- `python ai/load_forecaster.py`

## Why RandomForest Instead of LSTM (for MVP)

We use RandomForest in the MVP because it is:

- easy to explain to student teams and judges
- fast to train on small datasets
- stable without GPU dependencies
- simpler to debug than deep sequence models

LSTM is intentionally not used in this MVP because it usually needs larger
historical datasets, longer training, and more complex tuning.

## Data Used

Input data source:

- `data/synthetic_building_load.csv`

Main columns used:

- `hour`
- `base_load_kw` (target)
- `unmanaged_ev_load_kw`

Because only one 24-hour day is available, the module creates multiple
synthetic days by adding small random noise around the daily pattern.
This provides enough training rows for a lightweight prototype model.

## Feature Set

Model features:

- `hour`
- `sin_hour`
- `cos_hour`
- `is_peak_hour`
- `previous_1h_load`
- `previous_2h_load`
- `previous_3h_load`
- `unmanaged_ev_load_kw`

Target:

- `base_load_kw`

## Forecast Horizon

The model forecasts:

- next `6` hours

Each prediction returns:

- `hour`
- `predicted_base_load_kw`
- `is_peak_hour`

## API Response Shape

```json
{
  "model": "RandomForestRegressor",
  "forecast_horizon_hours": 6,
  "predictions": [
    {
      "hour": 18,
      "predicted_base_load_kw": 92.5,
      "is_peak_hour": true
    }
  ],
  "feature_importance": [
    {
      "feature": "hour",
      "importance": 0.31
    }
  ],
  "note": "MVP forecast trained on augmented synthetic data for prototype demonstration."
}
```

## CLI Output

Running `python ai/load_forecaster.py` prints:

1. next 6 forecasted hours and `predicted_base_load_kw`
2. a simple feature importance table

## Why This Is MVP-Level Forecasting

This forecast is useful for demonstration, but it is still prototype-grade:

- trained on synthetic, short-history data
- not validated on real meter behavior across weeks/months
- no production retraining pipeline yet

## Future Upgrade Path (Real Smart Meter Data)

To move toward production, upgrade the module with:

1. real hourly (or sub-hourly) smart meter data
2. longer historical window (weeks to months)
3. weather/calendar/holiday features
4. model validation and monitoring pipeline
5. periodic retraining and drift checks

This keeps the MVP simple now, while giving a clear path to stronger forecasts later.
