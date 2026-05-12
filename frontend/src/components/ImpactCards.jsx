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
        <h3>Green Impact Metrics</h3>
        <p className="muted-text">
          Impact data is not available yet.
        </p>
      </>
    );
  }

  const items = [
    {
      label: "CO2 Avoided",
      value: `${formatNumber(
        impact.co2_saved_kg,
        2
      )} kg`,
    },
    {
      label: "Trees Equivalent",
      value: `${formatNumber(
        impact.trees_equivalent,
        2
      )} trees/year`,
    },
    {
      label: "Petrol Equivalent",
      value: `${formatNumber(
        impact.petrol_equivalent_liters,
        2
      )} liters`,
    },
    {
      label: "Shifted Energy",
      value: `${formatNumber(
        impact.shifted_kwh,
        2
      )} kWh`,
    },
  ];

  return (
    <>
      <h3>Green Impact Metrics</h3>
      <p className="muted-text">
        Prototype estimate based on configurable
        emission factors.
      </p>

      <div className="impact-grid">
        {items.map((item) => (
          <article
            key={item.label}
            className="impact-card"
          >
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </>
  );
}

export default ImpactCards;
