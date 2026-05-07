import React from "react";

function KPICards({ billing }) {
  if (!billing) {
    return <p>Billing KPI data is not available yet.</p>;
  }

  const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const formatVnd = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      Number(value ?? 0)
    );

  const cards = [
    { label: "Total kWh", value: billing.total_kwh, formatter: formatNumber },
    { label: "Peak kWh", value: billing.peak_kwh, formatter: formatNumber },
    { label: "Off-peak kWh", value: billing.offpeak_kwh, formatter: formatNumber },
    { label: "Shifted kWh", value: billing.shifted_kwh, formatter: formatNumber },
    { label: "Estimated Cost", value: billing.estimated_cost_vnd, formatter: formatVnd },
    { label: "Estimated Saving", value: billing.estimated_saving_vnd, formatter: formatVnd },
    { label: "Incentive Value", value: billing.incentive_value_vnd, formatter: formatVnd },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{ border: "1px solid #d9e3f0", borderRadius: 10, background: "#ffffff", padding: 12 }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>{card.label}</p>
          <p style={{ margin: "6px 0 0 0", fontWeight: 700, fontSize: 20 }}>
            {card.formatter(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default KPICards;
