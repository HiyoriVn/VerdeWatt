with open('frontend/src/pages/staff/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('const isDashboardOverview =\n    activeTab === "dashboard";', 'const isDashboardOverview =\n    activeTab === "dashboard" || activeTab === "charging-sessions";')

content = content.replace('<EVSessionCard session={session} isSelected={selectedEvId === session.id} />', '<ChargingEVSessionCard session={session} isSelected={selectedEvId === session.id} />')

if 'import ChargingEVSessionCard' not in content:
    content = content.replace('import ChargingHeroBanner from "../../components/dashboard/ChargingHeroBanner";', 'import ChargingHeroBanner from "../../components/dashboard/ChargingHeroBanner";\nimport ChargingEVSessionCard from "../../components/charging/ChargingEVSessionCard";')

with open('frontend/src/pages/staff/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
