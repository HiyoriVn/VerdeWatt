# VerdeWatt Anomaly Rules (MVP)

This document defines simple rule-based security alerts for the VerdeWatt MVP.
The design goal is to keep logic easy to understand and easy to test.

## Scope

- Rule-based checks only (no ML/LSTM)
- No auth, database, payment, Docker, or OCPP integrations
- Alerts are generated from sample session data and mock charger health data

## Alert Format

Each alert returned by the backend includes:

- `id`
- `timestamp`
- `severity`
- `title`
- `message`
- `suggested_action`
- `related_session_id` or `related_charger_id`

## Rule 1: Abnormal Power Request

- **Condition:** `max_charging_kw > 22`
- **Severity:** High
- **Why:** Most apartment AC charging scenarios should not exceed this safety threshold in the MVP.
- **Example action:** Cap charging power and verify charger/session configuration.

## Rule 2: Repeated or Suspicious Session

Two ways to trigger:

1. **Suspicious marker in sample data**
   - Session has `suspicious: true`, or follows the sample suspicious pattern (for demo data).
2. **Repeated request pattern**
   - Same pattern appears multiple times (priority + deadline + max power), suggesting possible replay/automation.

- **Severity:** Medium
- **Example action:** Review session metadata and apply rate limiting if needed.

## Rule 3: Charger Offline / DoS-like Behavior

Uses simple mock charger telemetry in the backend service.

- **Offline trigger:** charger status is offline
  - **Severity:** High
- **DoS-like trigger:** too many failed pings in a short window
  - Example threshold: `failed_pings >= 5`
  - **Severity:** Medium

- **Example action:** Check charger connectivity, inspect traffic, and apply network filtering/rate limiting.

## API Endpoint

- `GET /api/alerts`
- Returns sample alerts from all three rule groups.
