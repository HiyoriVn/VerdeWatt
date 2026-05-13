with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
import_old = """import {
  AlertCircle,
  Zap,
  Gauge,
  Zap as ZapIcon,
  BatteryCharging
} from "lucide-react";"""

import_new = """import {
  BatteryCharging,
  Clock,
  Activity,
  Zap
} from "lucide-react";"""

content = content.replace(import_old, import_new)

# 2. Update mini stats HTML
stats_old = """        {/* RIGHT MINI STATS */}
        <div className="hero-mini-stats charging-hero-stats">
          {/* ACTIVE EVs */}
          <article className="mini-stat-card mini-stat-card-ev">
            <div className="mini-stat-icon blue">
              <BatteryCharging size={22} strokeWidth={2.4} />
            </div>
            <div className="mini-stat-content">
              <strong>{activeEvs}</strong>
              <span>Active EVs</span>
            </div>
          </article>

          {/* URGENT SESSIONS */}
          <article className="mini-stat-card mini-stat-card-risk">
            <div className="mini-stat-icon red">
              <AlertCircle size={22} strokeWidth={2.4} />
            </div>
            <div className="mini-stat-content">
              <strong>{urgentSessions}</strong>
              <span>Urgent Sessions</span>
            </div>
          </article>

          {/* AVERAGE SOC */}
          <article className="mini-stat-card mini-stat-card-capacity">
            <div className="mini-stat-icon cyan">
              <Gauge size={22} strokeWidth={2.4} />
            </div>
            <div className="mini-stat-content">
              <strong>{averageSoc}</strong>
              <span>Average SOC</span>
            </div>
          </article>

          {/* MAX CAPACITY */}
          <article className="mini-stat-card mini-stat-card-ev">
            <div className="mini-stat-icon green">
              <ZapIcon size={22} strokeWidth={2.4} />
            </div>
            <div className="mini-stat-content">
              <strong>
                {safeCapacity}
                <small>kW</small>
              </strong>
              <span>Max Capacity</span>
            </div>
          </article>
        </div>"""

stats_new = """        {/* RIGHT MINI STATS */}
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

content = content.replace(stats_old, stats_new)

with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

css = """
/* Charging Stat Cards */
.charging-stat-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.charging-stat-icon {
  color: rgba(255, 255, 255, 0.3); /* Subtle icon color matching the screenshot */
  display: flex;
  align-items: center;
  justify-content: center;
}

.charging-stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.charging-stat-content strong {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.charging-stat-content span {
  font-size: 13px;
  color: #cbd5e1;
  font-weight: 500;
}
"""

with open('frontend/src/styles/components.css', 'a', encoding='utf-8') as f:
    f.write(css)
