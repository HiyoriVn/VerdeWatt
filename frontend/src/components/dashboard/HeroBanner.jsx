/* frontend/src/components/dashboard/HeroBanner.jsx */

import {
  Car,
  ShieldCheck,
  BatteryCharging,
} from "lucide-react";

import heroImage from "../../assets/dashboard/ev-hero.png";

function toFiniteNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? numericValue
    : null;
}

function formatNumber(value, maximumFractionDigits = 0) {
  if (value === null) {
    return "N/A";
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits,
  });
}

function formatSigned(value) {
  if (value === null) {
    return "N/A";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })}`;
}

function HeroBanner({
  allocation,
  sessions,
  alerts,
  loadData,
}) {
  const activeEvs =
    sessions?.length || 0;

  const alertCount =
    alerts?.length || 0;

  const safeCapacityValues = Array.isArray(loadData)
    ? loadData
        .map((item) =>
          toFiniteNumber(item.safe_capacity_kw)
        )
        .filter((value) => value !== null)
    : [];

  const safeCapacity =
    safeCapacityValues.length > 0
      ? Math.max(...safeCapacityValues)
      : null;

  const safetyMargin = toFiniteNumber(
    allocation?.peak_after_under_safe_capacity_kw
  );
  const peakReductionPercent =
    toFiniteNumber(
      allocation?.peak_reduction_percent
    );
  const peakReductionKw = toFiniteNumber(
    allocation?.peak_reduction_kw
  );
  const fullyServedCount = Array.isArray(
    allocation?.evs_fully_served
  )
    ? allocation.evs_fully_served.length
    : null;

  const isOperatingSafely =
    safetyMargin !== null
      ? safetyMargin >= 0
      : null;

  const statusLabel =
    isOperatingSafely === null
      ? "Awaiting allocation run"
      : isOperatingSafely
      ? "Operating within safe capacity"
      : "Peak risk: over safe capacity";

  const statusClass =
    isOperatingSafely === null
      ? "pending"
      : isOperatingSafely
      ? "safe"
      : "risk";

  const tertiaryStatValue =
    safetyMargin !== null
      ? formatSigned(safetyMargin)
      : formatNumber(safeCapacity);

  const tertiaryStatLabel =
    safetyMargin !== null
      ? "Safety Margin"
      : "Safe Capacity";

  return (
    <section className="hero-banner">
      {/* BACKGROUND IMAGE */}
      <div className="hero-bg-layer">
        <img
          src={heroImage}
          alt="EV charging"
          className="hero-image"
        />
      </div>

      {/* CONTENT LAYER */}
      <div className="hero-content-layer">
        {/* LEFT CONTENT */}
        <div className="hero-content">
          <div
            className={`hero-status ${statusClass}`}
          >
            <span className="status-dot" />
            {statusLabel}
          </div>

          <h2>
            <span className="hero-title-emphasis">
              Real-time EV energy
            </span>
            <br />
            orchestration
          </h2>

          <p>
            VerdeWatt orchestrates charging power
            by priority and deadline to keep
            building demand safe during peak hours.
          </p>

          <div className="hero-quick-chips">
            <span>
              Peak shift:{" "}
              {peakReductionKw !== null
                ? `${formatSigned(
                    peakReductionKw
                  )} kW`
                : "N/A"}
            </span>
            <span>
              Reduced:{" "}
              {peakReductionPercent !== null
                ? `${formatNumber(
                    peakReductionPercent,
                    1
                  )}%`
                : "N/A"}
            </span>
            <span>
              Fully served:{" "}
              {fullyServedCount !== null
                ? fullyServedCount
                : "N/A"}
            </span>
          </div>
        </div>

        {/* RIGHT MINI STATS */}
        <div className="hero-mini-stats">
          {/* ACTIVE EVs */}
          <article className="mini-stat-card mini-stat-card-ev">
            <div className="mini-stat-icon green">
              <Car
                size={22}
                strokeWidth={2.4}
              />
            </div>

            <div className="mini-stat-content">
              <strong>
                {activeEvs}
              </strong>

              <span>
                Active EVs
              </span>
            </div>
          </article>

          {/* SECURITY ALERTS */}
          <article className="mini-stat-card mini-stat-card-alert">
            <div className="mini-stat-icon blue">
              <ShieldCheck
                size={22}
                strokeWidth={2.4}
              />
            </div>

            <div className="mini-stat-content">
              <strong>
                {alertCount}
              </strong>

              <span>
                Security Alerts
              </span>
            </div>
          </article>

          {/* SAFE CAPACITY */}
          <article
            className={`mini-stat-card ${
              safetyMargin !== null &&
              safetyMargin < 0
                ? "mini-stat-card-risk"
                : "mini-stat-card-capacity"
            }`}
          >
            <div
              className={`mini-stat-icon ${
                safetyMargin !== null &&
                safetyMargin < 0
                  ? "red"
                  : "cyan"
              }`}
            >
              <BatteryCharging
                size={22}
                strokeWidth={2.4}
              />
            </div>

            <div className="mini-stat-content">
              <strong>
                {tertiaryStatValue}
                <small>kW</small>
              </strong>

              <span>
                {tertiaryStatLabel}
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
