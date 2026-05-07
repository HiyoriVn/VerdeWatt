import React from "react";

function KPICards({ billing }) {
  if (!billing) {
    return <p>Billing KPI data is not available yet.</p>;
  }

  const cards = [
    { label: "Total kWh", value: billing.total_kwh },
    { label: "Peak kWh", value: billing.peak_kwh },
    { label: "Off-peak kWh", value: billing.offpeak_kwh },
    { label: "Shifted kWh", value: billing.shifted_kwh },
    { label: "Estimated Cost (VND)", value: billing.estimated_cost_vnd },
    { label: "Estimated Saving (VND)", value: billing.estimated_saving_vnd },
    { label: "Incentive Value (VND)", value: billing.incentive_value_vnd },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{ border: "1px solid #d9e3f0", borderRadius: 10, background: "#ffffff", padding: 12 }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>{card.label}</p>
          <p style={{ margin: "6px 0 0 0", fontWeight: 700, fontSize: 20 }}>{Number(card.value ?? 0).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default KPICards;
