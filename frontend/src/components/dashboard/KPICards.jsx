import {
  ArrowLeftRight,
  Gift,
  Leaf,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

function KPICards({ billing }) {
  if (!billing) {
    return (
      <section className="card glass-card">
        <p className="muted-text">
          Billing KPI data is not available yet.
        </p>
      </section>
    );
  }

  const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

  const formatVnd = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

  const cards = [
    {
      label: "Total kWh",
      value: billing.total_kwh,
      formatter: formatNumber,
      unit: "kWh",
      Icon: Zap,
      tone: "kpi-blue",
    },
    {
      label: "Peak kWh",
      value: billing.peak_kwh,
      formatter: formatNumber,
      unit: "kWh",
      Icon: TrendingUp,
      tone: "kpi-red",
    },
    {
      label: "Off-peak kWh",
      value: billing.offpeak_kwh,
      formatter: formatNumber,
      unit: "kWh",
      Icon: TrendingDown,
      tone: "kpi-cyan",
    },
    {
      label: "Shifted kWh",
      value: billing.shifted_kwh,
      formatter: formatNumber,
      unit: "kWh",
      Icon: ArrowLeftRight,
      tone: "kpi-purple",
    },
    {
      label: "Estimated Cost",
      value: billing.estimated_cost_vnd,
      formatter: formatVnd,
      Icon: Wallet,
      tone: "kpi-amber",
    },
    {
      label: "Estimated Saving",
      value: billing.estimated_saving_vnd,
      formatter: formatVnd,
      Icon: Leaf,
      tone: "kpi-green",
    },
    {
      label: "Incentive Value",
      value: billing.incentive_value_vnd,
      formatter: formatVnd,
      Icon: Gift,
      tone: "kpi-violet",
    },
  ];

  return (
    <div className="kpi-row">
      {cards.map((card) => {
        const Icon = card.Icon;

        return (
          <article
            key={card.label}
            className={`card glass-card kpi-card ${card.tone}`}
          >
            <div className="kpi-card-top">
              <p>{card.label}</p>

              <span className="kpi-card-icon">
                <Icon size={16} />
              </span>
            </div>

            <h2>
              {card.formatter(card.value)}
              {card.unit ? <small>{card.unit}</small> : null}
            </h2>
          </article>
        );
      })}
    </div>
  );
}

export default KPICards;
