with open('frontend/src/components/dashboard/ImpactCards.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = """import React from "react";
import { Cloud, Trees, Droplet, Zap } from "lucide-react";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value, digits = 2) {
  return toNumber(value).toLocaleString(
    undefined,
    {
      maximumFractionDigits: digits,
    }
  );
}

function ImpactCards({ impact }) {
  if (!impact) {
    return (
      <>
        <div className="section-title-wrap">
          <h3 style={{ fontSize: '18px', margin: 0 }}>Green Impact Metrics</h3>
          <p className="muted-text" style={{ marginTop: '4px' }}>
            Impact data is not available yet.
          </p>
        </div>
      </>
    );
  }

  const items = [
    {
      label: "CO2 Avoided",
      value: formatNumber(impact.co2_saved_kg, 2),
      unit: "kg",
      icon: Cloud,
      colorClass: "kpi-cyan"
    },
    {
      label: "Trees Equivalent",
      value: formatNumber(impact.trees_equivalent, 2),
      unit: "trees/year",
      icon: Trees,
      colorClass: "kpi-green"
    },
    {
      label: "Petrol Equivalent",
      value: formatNumber(impact.petrol_equivalent_liters, 2),
      unit: "liters",
      icon: Droplet,
      colorClass: "kpi-amber"
    },
    {
      label: "Shifted Energy",
      value: formatNumber(impact.shifted_kwh, 2),
      unit: "kWh",
      icon: Zap,
      colorClass: "kpi-purple"
    },
  ];

  return (
    <>
      <div className="section-title-wrap" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', margin: 0 }}>Green Impact Metrics</h3>
        <p className="muted-text" style={{ marginTop: '4px' }}>
          Prototype estimate based on configurable emission factors.
        </p>
      </div>

      <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {items.map((item) => (
          <article
            key={item.label}
            className={`card glass-card kpi-card ${item.colorClass}`}
            style={{ padding: '20px' }}
          >
            <div className="kpi-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{item.label}</p>
              <div className="kpi-card-icon">
                <item.icon size={18} />
              </div>
            </div>
            <h2 style={{ fontSize: '28px', margin: 0 }}>
              {item.value}<small style={{ fontSize: '14px', marginLeft: '4px', fontWeight: '500' }}>{item.unit}</small>
            </h2>
          </article>
        ))}
      </div>
    </>
  );
}

export default ImpactCards;
"""

with open('frontend/src/components/dashboard/ImpactCards.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
