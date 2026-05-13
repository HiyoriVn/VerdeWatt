import {
  BatteryCharging,
  Clock,
  Activity,
  Zap
} from "lucide-react";

import heroImage from "../../assets/dashboard/ev-hero.png";


function toFiniteNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? numericValue
    : null;
}

function ChargingHeroBanner({
  sessions,
  loadData,
}) {
  const activeEvs = sessions?.length || 0;

  const urgentSessions = sessions?.filter(
    (s) => String(s.priority).toLowerCase() === "urgent"
  ).length || 0;

  let averageSoc = "N/A";
  if (sessions && sessions.length > 0) {
    const totalSoc = sessions.reduce(
      (sum, s) => sum + Number(s.current_soc || 0),
      0
    );
    averageSoc = Math.round(totalSoc / sessions.length) + "%";
  }

  const safeCapacityValues = Array.isArray(loadData)
    ? loadData
        .map((item) => toFiniteNumber(item.safe_capacity_kw))
        .filter((value) => value !== null)
    : [];

  const safeCapacity =
    safeCapacityValues.length > 0
      ? Math.max(...safeCapacityValues)
      : "N/A";

  return (
    <section className="hero-banner charging-hero-banner">



      {/* CONTENT LAYER */}
      <div className="hero-content-layer">
        {/* LEFT CONTENT */}
        <div className="hero-content">
          <div className="hero-status safe">
            <span className="status-dot" style={{ color: '#f59e0b' }}>⚡</span>
            Charging Network Active
          </div>

          <h2>
            <span className="hero-title-emphasis">
              Charging Operations
            </span>
            <br />
            Center
          </h2>

          <p style={{ maxWidth: '480px' }}>
            Monitor EV charging, prioritize urgent vehicles and optimize
            charging allocation across the smart grid.
          </p>
        </div>

        {/* RIGHT MINI STATS */}
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
        </div>
      </div>
    </section>
  );
}

export default ChargingHeroBanner;
