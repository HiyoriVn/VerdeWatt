# VerdeWatt Security Threat Model

## 1. What VerdeWatt Protects

VerdeWatt protects the safe operation of EV charging sessions in apartment buildings and urban residential communities.

The system focuses on:
- charging session integrity,
- charger availability,
- abnormal power request detection,
- safe building-level load allocation.

## 2. Threat 1: Abnormal Power Request

### Scenario
A session requests charging power far above a safe threshold.

### Example
EV_999 requests 120 kW while the safe threshold is 22 kW.

### Risk
This may distort scheduling, overload local capacity, or represent faulty/malicious session data.

### Detection
Trigger alert if max_charging_kw > 22.

### Mitigation
Cap charging current, verify session, or stop transaction.

## 3. Threat 2: Repeated or Fake Session Pattern

### Scenario
Multiple sessions share suspiciously similar metadata or a session is marked suspicious.

### Risk
Fake sessions may manipulate charging priority or overload scheduling.

### Detection
Trigger alert if suspicious marker is true or repeated pattern count exceeds threshold.

### Mitigation
Require session review before allocation.

## 4. Threat 3: Charger Offline / DoS-like Behavior

### Scenario
A charger misses repeated heartbeat checks or goes offline.

### Risk
The optimizer may allocate charging power to unavailable infrastructure.

### Detection
Trigger alert if failed pings >= 5 or charger status is offline.

### Mitigation
Exclude charger from allocation and inspect connectivity.

## 5. MVP Limitations

The MVP uses rule-based detection and mock charger data.
It does not implement full OCPP, hardware-level security, authentication, or encrypted telemetry.

## 6. Future Work

Future versions may include:
- secure OCPP integration,
- charger authentication,
- signed telemetry,
- anomaly detection using historical charging logs,
- role-based access control,
- IEC 62443-inspired industrial security practices.
