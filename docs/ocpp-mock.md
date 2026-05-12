# VerdeWatt OCPP Mock Commands (MVP)

## Purpose

`GET /api/charger-commands` converts rule-based anomaly alerts into mock charger
control actions that look OCPP-compatible for demo flow.

This is not real charger control. There is no WebSocket, no real OCPP session,
and no hardware integration.

## Endpoint

- `GET /api/charger-commands`

## Data Source

- `backend/app/services/anomaly_detector.py` (`generate_sample_alerts`)

If alerts are available, command mapping is generated from alert title and
severity.

## Rule Mapping

### 1) Abnormal power request

If alert title contains `Abnormal power request`:

- command is `RemoteStopTransaction` (high severity) or `SetChargingProfile`
- anchored to `EV_999` / `CHG_09` for demo consistency

Example:

```json
{
  "charger_id": "CHG_09",
  "related_ev_id": "EV_999",
  "command": "RemoteStopTransaction",
  "reason": "High-severity abnormal power request detected",
  "status": "mock_only",
  "note": "MVP mock command, not a real OCPP implementation"
}
```

### 2) Charger offline

If alert title contains `Charger offline`:

- command is `ExcludeFromAllocation` (high severity) or `InspectCharger`
- targets `related_charger_id` from the alert when available

### 3) Repeated session

If alert title contains `Repeated session`:

- command is `RequireSessionReview`
- includes `related_ev_id` when available

## Command Payload Fields

Each command includes:

- `charger_id`
- `related_ev_id` (nullable)
- `command`
- `reason`
- `status` = `mock_only`
- `note` = `MVP mock command, not a real OCPP implementation`
- `max_current_amp` only when current capping is relevant

## MVP Scope Guardrails

- No real OCPP protocol handling
- No WebSocket channel
- No authentication
- No database persistence
- No payment integration
- No Docker or heavy dependencies
