import React from "react";

function KPICards({ billing }) {
  if (!billing) {
    return (
      <div className="dashboard-card">
        <p>Billing KPI data is not available yet.</p>
      </div>
    );
  }

  const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString(
      undefined,
      {
        maximumFractionDigits: 2,
      }
    );

  const formatVnd = (value) =>
    new Intl.NumberFormat(
      "vi-VN",
      {
        style: "currency",
        currency: "VND",
      }
    ).format(Number(value ?? 0));

  const cards = [
    {
      label: "Total kWh",
      value: billing.total_kwh,
      formatter: formatNumber,
      accent: "#3b82f6",
    },

    {
      label: "Peak kWh",
      value: billing.peak_kwh,
      formatter: formatNumber,
      accent: "#ef4444",
    },

    {
      label: "Off-peak kWh",
      value: billing.offpeak_kwh,
      formatter: formatNumber,
      accent: "#22c55e",
    },

    {
      label: "Shifted kWh",
      value: billing.shifted_kwh,
      formatter: formatNumber,
      accent: "#8b5cf6",
    },

    {
      label: "Estimated Cost",
      value: billing.estimated_cost_vnd,
      formatter: formatVnd,
      accent: "#f59e0b",
    },

    {
      label: "Estimated Saving",
      value: billing.estimated_saving_vnd,
      formatter: formatVnd,
      accent: "#10b981",
    },

    {
      label: "Incentive Value",
      value: billing.incentive_value_vnd,
      formatter: formatVnd,
      accent: "#06b6d4",
    },
  ];

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className="dashboard-card"
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",

              top: 0,
              left: 0,

              width: 5,
              height: "100%",

              background: card.accent,
            }}
          />

          <p
            style={{
              margin: 0,

              fontSize: 13,

              color: "var(--text-soft)",
            }}
          >
            {card.label}
          </p>

          <h2
            style={{
              marginTop: 12,
              marginBottom: 0,

              fontSize: 28,

              color: card.accent,

              lineHeight: 1.2,
            }}
          >
            {card.formatter(card.value)}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default KPICards;