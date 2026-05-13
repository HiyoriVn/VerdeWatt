with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update mini stats HTML for colored icons
stats_old = """        {/* RIGHT MINI STATS */}
        <div className="hero-mini-stats charging-hero-stats">
          {/* ACTIVE EVs */}
          <article className="charging-stat-card">
            <div className="charging-stat-icon">
              <BatteryCharging size={20} strokeWidth={2} />
            </div>
            <div className="charging-stat-content">
              <strong>{activeEvs}</strong>
              <span>Active EVs</span>
            </div>
          </article>

          {/* URGENT SESSIONS */}
          <article className="charging-stat-card">
            <div className="charging-stat-icon">
              <Clock size={20} strokeWidth={2} />
            </div>
            <div className="charging-stat-content">
              <strong>{urgentSessions}</strong>
              <span>Urgent Sessions</span>
            </div>
          </article>

          {/* AVERAGE SOC */}
          <article className="charging-stat-card">
            <div className="charging-stat-icon">
              <Activity size={20} strokeWidth={2} />
            </div>
            <div className="charging-stat-content">
              <strong>{averageSoc}</strong>
              <span>Average SOC</span>
            </div>
          </article>

          {/* MAX CAPACITY */}
          <article className="charging-stat-card">
            <div className="charging-stat-icon">
              <Zap size={20} strokeWidth={2} />
            </div>
            <div className="charging-stat-content">
              <strong>
                {safeCapacity}kW
              </strong>
              <span>Max Capacity</span>
            </div>
          </article>
        </div>"""

stats_new = """        {/* RIGHT MINI STATS */}
        <div className="hero-mini-stats charging-hero-stats">
          {/* ACTIVE EVs */}
          <article className="charging-stat-card">
            <div className="charging-stat-icon blue-icon">
              <BatteryCharging size={28} strokeWidth={2.4} />
            </div>
            <div className="charging-stat-content">
              <strong>{activeEvs}</strong>
              <span>Active EVs</span>
            </div>
          </article>

          {/* URGENT SESSIONS */}
          <article className="charging-stat-card">
            <div className="charging-stat-icon red-icon">
              <Clock size={28} strokeWidth={2.4} />
            </div>
            <div className="charging-stat-content">
              <strong>{urgentSessions}</strong>
              <span>Urgent Sessions</span>
            </div>
          </article>

          {/* AVERAGE SOC */}
          <article className="charging-stat-card">
            <div className="charging-stat-icon cyan-icon">
              <Activity size={28} strokeWidth={2.4} />
            </div>
            <div className="charging-stat-content">
              <strong>{averageSoc}</strong>
              <span>Average SOC</span>
            </div>
          </article>

          {/* MAX CAPACITY */}
          <article className="charging-stat-card">
            <div className="charging-stat-icon green-icon">
              <Zap size={28} strokeWidth={2.4} />
            </div>
            <div className="charging-stat-content">
              <strong>
                {safeCapacity}<small style={{fontSize: '18px', fontWeight: '600', marginLeft: '2px', color: '#cbd5e1'}}>kW</small>
              </strong>
              <span>Max Capacity</span>
            </div>
          </article>
        </div>"""

if stats_old in content:
    content = content.replace(stats_old, stats_new)
else:
    print("Warning: old stats block not found. Trying flexible replacement.")

with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

css = """
/* Colored Icons and Alignment Fixes */
.charging-hero-banner .charging-stat-icon {
  opacity: 1 !important; /* Restore opacity */
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 4px;
}

.charging-stat-icon.blue-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
}

.charging-stat-icon.red-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.1);
}

.charging-stat-icon.cyan-icon {
  background: rgba(6, 182, 212, 0.15);
  color: #22d3ee;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
}

.charging-stat-icon.green-icon {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.1);
}

.charging-hero-banner .charging-stat-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.charging-hero-banner .charging-stat-content strong {
  font-size: 38px !important; /* Slightly reduced so text balances better */
  line-height: 1.1;
  display: flex;
  align-items: baseline;
}

.charging-hero-banner .charging-stat-content span {
  font-size: 14px !important;
  color: #cbd5e1;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.charging-hero-banner .charging-stat-card {
  gap: 16px !important;
  padding: 20px 24px !important; /* Balanced padding */
}
"""

with open('frontend/src/styles/components.css', 'a', encoding='utf-8') as f:
    f.write(css)
