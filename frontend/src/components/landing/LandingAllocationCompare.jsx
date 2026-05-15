export default function LandingAllocationCompare({
  peakBeforeKw,
  peakAfterKw,
  peakReductionKw,
  peakReductionPercent,
  peakAfterIsSafe,
  loading,
}) {
  const safeMax = Math.max(peakBeforeKw, peakAfterKw, 1);
  const beforeWidth = `${Math.min(100, (peakBeforeKw / safeMax) * 100)}%`;
  const afterWidth = `${Math.min(100, (peakAfterKw / safeMax) * 100)}%`;

  return (
    <section
      className="lp-card lp-compare lp-reveal-child"
      style={{ "--reveal-delay": "120ms" }}
      aria-label="Peak load before and after optimization"
    >
      <div className="lp-compare__head">
        <h3>Before vs after allocation</h3>
        <p>
          {loading
            ? "Loading optimizer results…"
            : peakAfterIsSafe
              ? "Optimized peak stays within safe building capacity."
              : "Review allocation — peak still near capacity limit."}
        </p>
      </div>

      <div className="lp-compare__rows">
        <div className="lp-compare__row">
          <div className="lp-compare__label">
            <span>Before (unmanaged)</span>
            <strong>{loading ? "…" : `${peakBeforeKw} kW`}</strong>
          </div>
          <div className="lp-compare__track">
            <div
              className="lp-compare__fill lp-compare__fill--before"
              style={{ width: beforeWidth }}
            />
          </div>
        </div>

        <div className="lp-compare__row">
          <div className="lp-compare__label">
            <span>After VerdeWatt</span>
            <strong>{loading ? "…" : `${peakAfterKw} kW`}</strong>
          </div>
          <div className="lp-compare__track">
            <div
              className="lp-compare__fill lp-compare__fill--after"
              style={{ width: afterWidth }}
            />
          </div>
        </div>
      </div>

      <p className="lp-compare__summary">
        {loading ? (
          "…"
        ) : (
          <>
            <strong>−{peakReductionKw} kW</strong> peak reduction (
            {peakReductionPercent}% vs unmanaged charging)
          </>
        )}
      </p>
    </section>
  );
}
