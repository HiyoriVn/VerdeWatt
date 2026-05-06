# VerdeWatt Optimizer

## Goal

Allocate EV charging power so that:

total_building_load + total_ev_charging_load <= safe_capacity

## Inputs

- building base load by hour
- safe capacity
- EV sessions
- current SOC
- target SOC
- battery size
- deadline
- priority

## Step 1: Calculate spare capacity

spare_capacity_kw = safe_capacity_kw - base_load_kw

## Step 2: Sort EV sessions

Priority order:

1. urgent
2. normal
3. flexible

If same priority, sort by earliest deadline.

## Step 3: Allocate power

For each hour, allocate available spare capacity to EVs in priority order.

## Step 4: Output

- allocated power per EV per hour
- before peak load
- after peak load
- peak reduction
- shifted kWh