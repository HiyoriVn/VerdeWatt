import React from "react";

function AllocationSummary({ allocation }) {
  if (!allocation) {
    return (
      <div className="dashboard-card">
        <p>Allocation summary is not available yet.</p>
      </div>
    );
  }

  const safetyMarginKw = Number(
    allocation.peak_after_under_safe_capacity_kw ?? 0
  );

  const safetyLabel =
    safetyMarginKw >= 0
      ? "Safe"
      : "Unsafe";

  return (
    <div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
        }}
      >
        Smart Allocation Summary
      </h2>

      <div className="card-grid">
        <SummaryItem
          label="Peak Before"
          value={allocation.peak_before_kw}
          unit="kW"
          accent="#ef4444"
        />

        <SummaryItem
          label="Peak After"
          value={allocation.peak_after_kw}
          unit="kW"
          accent="#3b82f6"
        />

        <SummaryItem
          label="Peak Reduction"
          value={allocation.peak_reduction_percent}
          unit="%"
          accent="#22c55e"
        />

        <SummaryItem
          label={`Safety Margin (${safetyLabel})`}
          value={safetyMarginKw}
          unit="kW"
          accent={
            safetyMarginKw >= 0
              ? "#22c55e"
              : "#ef4444"
          }
        />
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  unit,
  accent,
}) {
  const numericValue = Number(value ?? 0);

  return (
    <div className="dashboard-card">
      <p
        style={{
          margin: 0,

          fontSize: 13,

          color: "var(--text-soft)",
        }}
      >
        {label}
      </p>

      <h2
        style={{
          marginTop: 10,
          marginBottom: 0,

          fontSize: 30,

          color: accent,
        }}
      >
        {numericValue.toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )}{" "}
        {unit || ""}
      </h2>
    </div>
  );
}

export default AllocationSummary;