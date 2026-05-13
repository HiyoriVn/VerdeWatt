import os

# 1. Update Dashboard.jsx to use standard EVSessionCard
dashboard_path = 'frontend/src/pages/staff/Dashboard.jsx'
with open(dashboard_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<ChargingEVSessionCard', '<EVSessionCard')
content = content.replace('import ChargingEVSessionCard from "../../components/charging/ChargingEVSessionCard";', '')

with open(dashboard_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update VehicleLookup.jsx to use standard cards
vehicle_path = 'frontend/src/components/charging/VehicleLookup.jsx'
with open(vehicle_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('vehicle-intelligence-card glass-panel', 'card')
content = content.replace('vehicle-header-box premium-box', 'card')
content = content.replace('vehicle-stat-box accent-box', 'card')

with open(vehicle_path, 'w', encoding='utf-8') as f:
    f.write(content)
