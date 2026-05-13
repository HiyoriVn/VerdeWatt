with open('frontend/src/components/charging/VehicleLookup.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the boxes nicer by adding a specific class for colored icons
new_render = """  return (
    <div className="vehicle-intelligence-card glass-panel">
      <div className="vehicle-header-box premium-box">
        <div className="vehicle-title-row">
          <div>
            <span className="label">Selected Vehicle</span>
            <h2>{session.id}</h2>
          </div>
          <span className={`ev-priority-badge priority-${priorityKey}`}>{priorityKey}</span>
        </div>
        <div className="vehicle-recommendation-alert">
          <div className="alert-icon">✨</div>
          <p className="vehicle-recommendation-text">
            Vehicle requires optimized charging strategy based on SOC and deadline.
          </p>
        </div>
      </div>

      <div className="vehicle-stats-grid">
        <div className="vehicle-stat-box accent-box">
          <div className="stat-label">
            <Clock size={16} className="text-blue-500" />
            <span>Deadline</span>
          </div>
          <strong>{session.deadline_hour}:00</strong>
        </div>

        <div className="vehicle-stat-box accent-box">
          <div className="stat-label">
            <Battery size={16} className="text-green-500" />
            <span>Battery</span>
          </div>
          <strong>{session.battery_kwh}<small>kWh</small></strong>
        </div>

        <div className="vehicle-stat-box accent-box">
          <div className="stat-label">
            <BatteryCharging size={16} className="text-amber-500" />
            <span>SOC Progress</span>
          </div>
          <strong>{session.current_soc}% &rarr; {session.target_soc}%</strong>
        </div>

        <div className="vehicle-stat-box accent-box">
          <div className="stat-label">
            <Zap size={16} className="text-purple-500" />
            <span>Max Charging</span>
          </div>
          <strong>{session.max_charging_kw}<small>kW</small></strong>
        </div>
      </div>
    </div>
  );
"""

# We just replace the return statement block. Let's find it.
start_idx = content.find('  return (')
end_idx = content.find('  );\n}\n\nexport default VehicleLookup;') + 4
if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_render + content[end_idx:]

with open('frontend/src/components/charging/VehicleLookup.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

css = """
/* Premium Vehicle Intelligence Panel */
.glass-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.premium-box {
  background: linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.dark .premium-box {
  background: linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(30,41,59,0.2) 100%);
  border: 1px solid rgba(255,255,255,0.05);
}

.vehicle-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.vehicle-recommendation-alert {
  display: flex;
  gap: 12px;
  background: rgba(59, 130, 246, 0.08);
  padding: 12px;
  border-radius: 8px;
  align-items: center;
}

.vehicle-recommendation-alert .alert-icon {
  font-size: 18px;
}

.vehicle-recommendation-text {
  font-size: 13px !important;
  color: var(--text) !important;
  font-weight: 500;
  line-height: 1.4 !important;
}

.accent-box {
  background: rgba(255,255,255,0.4) !important;
  border: 1px solid rgba(0,0,0,0.05) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.accent-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.dark .accent-box {
  background: rgba(0,0,0,0.2) !important;
  border: 1px solid rgba(255,255,255,0.05) !important;
}

.accent-box strong small {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 2px;
}

.text-blue-500 { color: #3b82f6; }
.text-green-500 { color: #22c55e; }
.text-amber-500 { color: #f59e0b; }
.text-purple-500 { color: #a855f7; }
"""

with open('frontend/src/styles/components.css', 'a', encoding='utf-8') as f:
    f.write(css)
