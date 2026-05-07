import React from "react";

function AllocationSummary({ allocation }) {
  if (!allocation) {
    return <p>Allocation summary is not available yet.</p>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      <SummaryItem label="Peak Before (kW)" value={allocation.peak_before_kw} />
      <SummaryItem label="Peak After (kW)" value={allocation.peak_after_kw} />
      <SummaryItem label="Peak Reduction (kW)" value={allocation.peak_reduction_kw} />
      <SummaryItem label="Peak Reduction (%)" value={allocation.peak_reduction_percent} />
      <SummaryItem label="Fully Served EVs" value={(allocation.evs_fully_served || []).length} />
      <SummaryItem label="Partially Served EVs" value={(allocation.evs_partially_served || []).length} />
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div style={{ border: "1px solid #d9e3f0", borderRadius: 10, padding: 12, background: "#ffffff" }}>
      <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>{label}</p>
      <p style={{ margin: "6px 0 0 0", fontSize: 20, fontWeight: 700 }}>{Number(value ?? 0).toLocaleString()}</p>
    </div>
  );
}

export default AllocationSummary;
