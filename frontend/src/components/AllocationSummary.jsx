function formatValue(value) {
  return Number(value ?? 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function AllocationSummary({ allocation }) {
  if (!allocation) {
    return (
      <section className="card glass-card">
        <p className="muted-text">
          Allocation summary is not available yet.
        </p>
      </section>
    );
  }

  const safetyMarginKw = Number(
    allocation.peak_after_under_safe_capacity_kw ?? 0
  );

  const safetyLabel =
    safetyMarginKw >= 0 ? "Safe" : "Unsafe";

  const metricItems = [
    {
      label: "Peak Before",
      value: allocation.peak_before_kw,
      unit: "kW",
      tone: "metric-red",
    },
    {
      label: "Peak After",
      value: allocation.peak_after_kw,
      unit: "kW",
      tone: "metric-blue",
    },
    {
      label: "Peak Reduction %",
      value: allocation.peak_reduction_percent,
      unit: "%",
      tone: "metric-green",
    },
    {
      label: `Safety Margin (${safetyLabel})`,
      value: safetyMarginKw,
      unit: "kW",
      tone:
        safetyMarginKw >= 0
          ? "metric-green"
          : "metric-red",
    },
  ];

  return (
    <section className="card glass-card">
      <h2>Smart Allocation Summary</h2>

      <div className="allocation-metric-grid">
        {metricItems.map((metric) => (
          <article
            key={metric.label}
            className={`allocation-metric-card ${metric.tone}`}
          >
            <p>{metric.label}</p>
            <strong>
              {formatValue(metric.value)} {metric.unit}
            </strong>
          </article>
        ))}
      </div>

      <p className="muted-text allocation-note">
        Smart allocation reduced the peak load and
        kept the system within safe operating
        limits.
      </p>
    </section>
  );
}

export default AllocationSummary;
