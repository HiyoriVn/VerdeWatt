import {
  Activity,
  Gauge,
  Shield,
  Zap,
} from "lucide-react";

function formatValue(value) {
  return Number(value ?? 0).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 2,
    }
  );
}

function MetricItem({
  icon,
  label,
  value,
  unit,
  accent,
}) {
  return (
    <div className="allocation-row">

      <div className="allocation-row-left">

        <span className="allocation-icon">
          {icon}
        </span>

        <span className="allocation-label">
          {label}
        </span>

      </div>

      <strong
        className={`allocation-value ${accent || ""}`}
      >
        {formatValue(value)}
        {unit ? ` ${unit}` : ""}
      </strong>

    </div>
  );
}

export default function AllocationSummary({
  allocation,
}) {
  if (!allocation) {
    return (
      <section className="card glass-card allocation-summary-card">
        <p className="muted-text">
          Allocation summary
          is not available yet.
        </p>
      </section>
    );
  }

  const reduction =
    Number(
      allocation?.peak_reduction_percent ??
        0
    );

  const safeMargin =
    Number(
      allocation?.peak_after_under_safe_capacity_kw ??
        0
    );

  const progress =
    Math.min(
      Math.max(reduction, 0),
      100
    );

  return (
    <section className="card glass-card allocation-summary-card">

      <h2 className="allocation-title">
        Smart Allocation Summary
      </h2>

      <div className="allocation-layout">

        {/* LEFT */}

        <div className="allocation-metrics">

          <MetricItem
            icon={<Zap size={14} />}
            label="Peak Before"
            value={
              allocation?.peak_before_kw
            }
            unit="kW"
          />

          <MetricItem
            icon={<Activity size={14} />}
            label="Peak After"
            value={
              allocation?.peak_after_kw
            }
            unit="kW"
          />

          <MetricItem
            icon={<Gauge size={14} />}
            label="Peak Reduction"
            value={reduction}
            unit="%"
            accent="positive"
          />

          <MetricItem
            icon={<Shield size={14} />}
            label="Safety Margin (Safe)"
            value={safeMargin}
            unit="kW"
          />

          <p className="allocation-note">
            Smart allocation reduced
            the peak load and kept
            the system within safe
            operating limits.
          </p>

        </div>

        {/* RIGHT RING */}

        <div className="allocation-ring-wrap">

          <div
            className="allocation-ring"
            style={{
              background: `conic-gradient(
                #22c55e ${
                  progress * 3.6
                }deg,
                #dff7ee 0deg
              )`,
            }}
          >

            <div className="allocation-ring-inner">

              <strong>
                {formatValue(
                  reduction
                )}
                %
              </strong>

              <span>
                Peak Reduction
              </span>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}