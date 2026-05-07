# VerdeWatt Product Strategy and Future Direction

## 1. Current Strategic Direction

VerdeWatt should not be positioned as only a simulation dashboard.

The stronger positioning is:

> VerdeWatt is a safety-first smart EV charging platform that helps apartment buildings and urban communities charge more electric vehicles without overloading local electrical infrastructure.

In Vietnamese:

> VerdeWatt là nền tảng sạc xe điện thông minh ưu tiên an toàn, giúp chung cư và khu đô thị phục vụ nhiều xe điện hơn mà không gây quá tải hạ tầng điện cục bộ.

The product should be understood as a practical safety and optimization solution for EV charging in urban buildings, apartment complexes, residential areas, and dense cities.

The dashboard is only the visible interface. The real value of VerdeWatt is the decision engine behind it:

- forecast building load,
- calculate safe charging capacity,
- schedule EV sessions,
- allocate charging power,
- reduce charging cost,
- notify charging status,
- detect abnormal or unsafe charging behavior.

---

## 2. Problem Framing

Vietnam and many Asian cities are accelerating the transition to electric vehicles. However, many apartments and urban residential buildings were not designed for many EVs charging at the same time.

The key problem is not only the lack of chargers. The deeper problem is local electrical safety:

- evening household electricity demand is already high,
- many EV owners want to charge after returning home,
- unmanaged EV charging can push total building load above safe capacity,
- this can increase overload, outage, and fire-safety risks,
- building managers may respond by banning or limiting EV charging,
- this slows down EV adoption in dense cities.

VerdeWatt addresses this bottleneck with software-first optimization before expensive hardware upgrades are required.

---

## 3. Product Identity

### VerdeWatt is:

- an EV charging safety platform,
- a building-level smart charging optimizer,
- a charging operations dashboard for building managers and operators,
- a user-facing charging status and scheduling tool,
- a cybersecurity-aware monitoring layer for charging infrastructure.

### VerdeWatt is not:

- a generic EV charging map,
- a payment app,
- a charger manufacturer,
- a full OCPP implementation in the MVP,
- a production-grade AI system in the MVP,
- a hardware integration project during the hackathon stage.

---

## 4. Core Users

VerdeWatt should support three user groups.

### 4.1 Building Manager / Residential Operator

They need to know:

- how many EVs are charging or waiting,
- whether total load is near the safe capacity limit,
- which vehicles should be prioritized,
- whether the system is reducing overload risk,
- whether abnormal charger behavior exists.

This should be the main dashboard user.

### 4.2 EV Owner / Resident

They need to know:

- whether their vehicle is charging,
- when charging is expected to finish,
- whether their session was delayed to reduce cost or avoid overload,
- estimated charging cost,
- estimated saving from smart scheduling.

The MVP can support this without login by allowing users to search their registered vehicle/session code, for example `EV_001`.

### 4.3 Charging Operator / Security Operator

They need to know:

- charger health status,
- suspicious sessions,
- abnormal power requests,
- offline or DoS-like charger behavior,
- suggested safety actions.

---

## 5. Product Layers

VerdeWatt should be described as a three-layer platform.

### 5.1 Safety Layer

Goal:

> Keep EV charging within the building's safe electrical capacity.

Capabilities:

- monitor building load,
- calculate spare safe capacity,
- detect overload risk,
- cap charging power when needed,
- generate safety warnings.

### 5.2 Optimization Layer

Goal:

> Decide which EVs should charge now, which should charge later, and how much power each session receives.

Capabilities:

- prioritize urgent EVs,
- delay flexible EVs to off-peak hours,
- respect user deadlines,
- reduce peak load,
- keep optimized load under safe capacity.

### 5.3 User and Cost Layer

Goal:

> Make smart charging useful and understandable for residents and building managers.

Capabilities:

- show charging status,
- estimate completion time,
- compare fast charging vs smart/off-peak charging,
- estimate charging cost,
- estimate savings,
- support future billing or incentive logic.

---

## 6. Current MVP Scope

The current MVP should focus on proving the core decision logic through simulation.

### Must-have MVP capabilities

- Synthetic building load data
- Synthetic EV charging session data
- Rule-based smart charging optimizer
- FastAPI backend
- React dashboard
- Load curve and safe capacity visualization
- Before/after optimization metrics
- Billing and impact KPI simulation
- Rule-based security alert module
- API documentation

### Important UI improvements

The current dashboard should evolve into a more product-like interface:

1. Landing page
   - introduce VerdeWatt,
   - explain the problem,
   - show call-to-action buttons such as `Open Dashboard` and `Check My Vehicle`.

2. Building manager dashboard
   - building load,
   - unmanaged vs optimized load,
   - EV sessions,
   - safety margin,
   - cost and impact KPIs,
   - security alerts.

3. Vehicle lookup page
   - user enters a vehicle/session code,
   - sees charging status,
   - estimated completion time,
   - cost estimate,
   - saving from smart scheduling.

4. Security/operator view
   - abnormal sessions,
   - high-power requests,
   - offline charger alerts,
   - suggested actions.

---

## 7. AI Strategy

The team still wants VerdeWatt to have a strong AI direction.

However, the AI scope should be staged carefully.

### 7.1 Why not LSTM immediately?

LSTM stands for Long Short-Term Memory. It is a neural network architecture often used for time-series forecasting.

In VerdeWatt, LSTM could theoretically forecast building electricity load based on historical load patterns.

However, full LSTM forecasting is not recommended as the immediate MVP core because:

- the team does not yet have real building smart-meter data,
- LSTM trained only on synthetic data may not be convincing,
- training and debugging can consume too much time,
- deep learning results are harder to explain,
- model instability could hurt the demo.

For the MVP, a reliable and explainable optimizer is more valuable than a weak deep learning claim.

### 7.2 Current AI position

The MVP should be described as:

> An explainable smart optimization engine with a roadmap toward machine-learning-based load forecasting.

This is honest and defensible.

### 7.3 Recommended AI roadmap

#### Stage 1: Rule-based optimization, current MVP

Use:

- safe capacity calculation,
- priority rules,
- deadline-based scheduling,
- cost-aware off-peak shifting.

This stage proves the decision logic.

#### Stage 2: Lightweight ML forecasting, if time allows

Possible models:

- Linear Regression,
- RandomForestRegressor,
- GradientBoostingRegressor,
- Prophet if time-series structure becomes important.

Potential input features:

- hour of day,
- day type,
- previous load,
- peak-hour flag,
- number of active EV sessions,
- weather proxy if available,
- historical building load.

Target:

- predicted building base load,
- predicted spare capacity,
- overload risk score.

This stage gives VerdeWatt a more concrete AI component without the risk of LSTM.

#### Stage 3: Advanced forecasting, future work

Possible advanced models:

- LSTM,
- Temporal Convolutional Networks,
- Transformer-based time-series forecasting,
- hybrid forecasting plus optimization.

Only pursue this when real load data is available.

---

## 8. OCPP Strategy

OCPP stands for Open Charge Point Protocol. It is a standard protocol that allows a central system to communicate with EV chargers.

A real OCPP system may handle messages such as:

- charger boot notification,
- authorization,
- start transaction,
- stop transaction,
- meter values,
- set charging profile,
- remote stop transaction.

### Why not full OCPP in the MVP?

Full OCPP implementation is not recommended during the current hackathon MVP because it requires:

- OCPP server logic,
- WebSocket handling,
- charger simulator or real charger hardware,
- protocol-specific message validation,
- reliability testing,
- security handling,
- significant debugging time.

### MVP approach

Use an OCPP-compatible mock layer.

The MVP can simulate control commands such as:

```json
{
  "charger_id": "CHG_01",
  "command": "SetChargingProfile",
  "max_current_amp": 16,
  "reason": "Building load is near safe capacity"
}
```

or:

```json
{
  "charger_id": "CHG_09",
  "command": "RemoteStopTransaction",
  "reason": "Abnormal power request detected"
}
```

This lets the team show that VerdeWatt is designed for real charger integration without implementing the entire protocol.

---

## 9. Dataset Strategy: Global EV Charging Stations Dataset

The Global EV Charging Stations Dataset may be useful, but it is important to understand what it can and cannot train.

### What this dataset is likely useful for

A global EV charging station dataset usually contains information such as:

- station location,
- charger type,
- connector type,
- charging speed,
- operator,
- availability metadata,
- station distribution.

It can help with:

- market/context analysis,
- map visualization,
- charger infrastructure density analysis,
- identifying gaps in EV charging coverage,
- building a future expansion story.

### What it is not enough for

This dataset is usually not enough to train VerdeWatt's core load forecasting model because it likely does not contain:

- building-level electricity load,
- real-time charger session data,
- per-hour EV charging demand,
- transformer capacity,
- resident charging deadlines,
- smart meter readings.

Therefore, it should not be used as the main training dataset for the current optimizer or load forecaster.

### How it could be used in VerdeWatt

Possible uses:

1. Add a research section in the proposal showing global EV infrastructure growth.
2. Create a future feature: charging infrastructure readiness map.
3. Analyze station density vs urban residential areas.
4. Generate realistic charger metadata for simulation.
5. Support a future site-selection or readiness scoring module.

### Recommendation

Do not spend too much time training a model on this dataset for the current MVP.

Use it mainly for:

- context,
- visualization,
- proposal evidence,
- future roadmap.

If the dataset includes usage/session/time-series fields, then it may become more useful for ML. Otherwise, it is not the right dataset for load forecasting.

---

## 10. Proposed 10-Day Direction

### Day 1: Strategy freeze

- Finalize product positioning.
- Create `docs/product-strategy.md`.
- Create or update `docs/user-flow.md`.
- Decide which UI pages are required.

### Day 2-3: Product-like UI structure

Build:

- landing page,
- main dashboard,
- vehicle lookup page,
- operator/security section.

No login required.

### Day 4: Vehicle lookup and charging status

Implement search by vehicle/session code.

Example output:

- vehicle ID,
- current SOC,
- target SOC,
- priority,
- estimated completion time,
- estimated cost,
- estimated saving,
- status message.

### Day 5: Smart schedule and cost comparison

Add practical user-facing recommendations:

- charge now,
- schedule overnight,
- complete by deadline,
- estimated saving.

### Day 6: OCPP-compatible mock commands

Add mock charger commands to demonstrate real deployment direction.

### Day 7: Optional lightweight ML forecaster

Only do this if the UI and core demo are stable.

Possible goal:

- add a simple scikit-learn forecasting demo,
- compare actual synthetic load vs predicted load,
- explain that this is MVP-level forecasting.

### Day 8: Proposal draft and screenshots

Use product screenshots and diagrams in proposal.

### Day 9: Demo video draft

Record first complete demo video.

### Day 10: Freeze and polish

Only fix bugs, improve text, and finalize submission materials.

---

## 11. Recommended Future Tagline

Current recommended tagline:

> Safe, smart, and cost-efficient EV charging for urban buildings.

Alternative:

> Helping cities charge EVs safely without overloading buildings.

Vietnamese:

> Sạc xe điện an toàn hơn cho chung cư và đô thị đang chuyển mình sang EV.

---

## 12. Final Strategic Note

VerdeWatt should compete not by claiming to be the most advanced AI system, but by being the most practical and well-scoped solution for a real EV adoption bottleneck.

The strongest message is:

> EV adoption in dense Asian cities will not only depend on vehicles and chargers. It will depend on whether buildings can charge safely, intelligently, and affordably.

VerdeWatt solves this building-level bottleneck.
