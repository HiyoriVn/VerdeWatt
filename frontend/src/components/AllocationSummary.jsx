import React from "react";

function AllocationSummary({ allocation }) {
  if (!allocation) {
    return <p>Allocation summary is not available yet.</p>;
  }

  const safetyMarginKw = Number(allocation.peak_after_under_safe_capacity_kw ?? 0);
  const safetyLabel = safetyMarginKw >= 0 ? "Safe" : "Unsafe";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      <SummaryItem label="Peak Before" value={allocation.peak_before_kw} unit="kW" accent="#b91c1c" />
      <SummaryItem label="Peak After" value={allocation.peak_after_kw} unit="kW" accent="#0369a1" />
      <SummaryItem label="Peak Reduction" value={allocation.peak_reduction_percent} unit="%" accent="#166534" />
      <SummaryItem
        label={`Safety Margin (${safetyLabel})`}
        value={safetyMarginKw}
        unit="kW"
        accent={safetyMarginKw >= 0 ? "#166534" : "#b91c1c"}
      />
    </div>
  );
}

function SummaryItem({ label, value, unit, accent }) {
  const numericValue = Number(value ?? 0);

  return (
    <div style={{ border: "1px solid #d9e3f0", borderRadius: 10, padding: 12, background: "#ffffff" }}>
      <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>{label}</p>
      <p style={{ margin: "6px 0 0 0", fontSize: 24, fontWeight: 700, color: accent || "#111827" }}>
        {numericValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {unit || ""}
      </p>
    </div>
  );
}

export default AllocationSummary;
