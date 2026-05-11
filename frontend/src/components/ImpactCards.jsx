function toNumber(value) {
  return Number(value ?? 0);
}

function ImpactCards({
  billing,
  allocation,
}) {
  if (!billing) {
    return (
      <>
        <h3>Green Impact Metrics</h3>
        <p className="muted-text">
          Billing data is required to estimate
          environmental impact.
        </p>
      </>
    );
  }

  const shiftedKwh = toNumber(billing.shifted_kwh);
  const totalKwh = toNumber(billing.total_kwh);
  const offPeakKwh = toNumber(billing.offpeak_kwh);

  const emissionFactorKgPerKwh = 0.72;

  const co2AvoidedKg = shiftedKwh * emissionFactorKgPerKwh;
  const offPeakRatio =
    totalKwh > 0
      ? (offPeakKwh / totalKwh) * 100
      : 0;

  const peakReduction = toNumber(
    allocation?.peak_reduction_percent
  );

  const treeEquivalent = co2AvoidedKg / 21;

  const items = [
    {
      label: "Shifted Energy",
      value: `${shiftedKwh.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} kWh`,
    },
    {
      label: "Estimated CO2 Avoided",
      value: `${co2AvoidedKg.toLocaleString(undefined, {
        maximumFractionDigits: 1,
      })} kg`,
    },
    {
      label: "Off-peak Share",
      value: `${offPeakRatio.toLocaleString(undefined, {
        maximumFractionDigits: 1,
      })}%`,
    },
    {
      label: "Peak Reduction",
      value: `${peakReduction.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}%`,
    },
    {
      label: "Tree Equivalent",
      value: `${treeEquivalent.toLocaleString(undefined, {
        maximumFractionDigits: 1,
      })} trees/year`,
    },
    {
      label: "Estimated Saving",
      value: `${toNumber(
        billing.estimated_saving_vnd
      ).toLocaleString()} VND`,
    },
  ];

  return (
    <>
      <h3>Green Impact Metrics</h3>
      <p className="muted-text">
        Sustainability indicators derived from
        billing and allocation results.
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
