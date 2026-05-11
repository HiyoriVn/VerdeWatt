# VerdeWatt OCPP Mock Commands (MVP)

## Purpose

This module provides **OCPP-compatible mock command payloads** for demo/testing.
It does not open WebSocket connections or talk to real charger hardware.

## Endpoint

- `GET /api/charger-commands`

Optional query:

- `preference=balanced|fastest|cheapest`
  - forwarded to scheduler recommendation mode

## Data Sources

Command generation combines:

1. Scheduler recommendations (`backend/app/services/scheduler.py`)
2. Security alerts (`backend/app/services/anomaly_detector.py`)

This allows commands to react to:

- charging urgency/flexibility
- delayed-for-safety states
- suspicious EV sessions like `EV_999`
- charger-level offline/DoS-like alerts

## Command Styles

### 1) Normal load control

Used for urgent/normal vehicles that can safely charge now.

```json
{
  "charger_id": "CHG_01",
  "related_ev_id": "EV_001",
  "command": "SetChargingProfile",
  "max_current_amp": 16,
  "reason": "Building load near safe capacity"
}
```

### 2) Flexible off-peak control

Used for flexible vehicles shifted to off-peak windows.

```json
{
  "charger_id": "CHG_06",
  "related_ev_id": "EV_006",
  "command": "SetChargingProfile",
  "max_current_amp": 8,
  "reason": "Flexible EV shifted to off-peak around 23:00"
}
```

### 3) Suspicious session protection

Used when abnormal/suspicious behavior is detected.

```json
{
  "charger_id": "CHG_09",
  "related_ev_id": "EV_999",
  "command": "RemoteStopTransaction",
  "reason": "Abnormal power request detected"
}
```

### 4) Charger health protection (mock)

Used for charger-level security alerts (offline/DoS-like).

```json
{
  "charger_id": "CHG-B2",
  "related_ev_id": null,
  "command": "CapPowerAndVerify",
  "reason": "Charger offline detected, verify network/device status"
}
```

## Rule Summary

- Urgent/normal vehicles -> `SetChargingProfile` (higher current profile)
- Flexible vehicles -> `SetChargingProfile` with lower current and off-peak reason
- Suspicious vehicles (`EV_999` or flagged by alerts) -> `RemoteStopTransaction`
- Charger offline/DoS-like alerts -> `CapPowerAndVerify`

## Important Notes

- This is mock-only behavior for MVP demos.
- No real OCPP communication, no WebSocket, and no charger hardware integration.
- No auth, database, payment, Docker, or LSTM added.
