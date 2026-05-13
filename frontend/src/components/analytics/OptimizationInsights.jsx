export default function OptimizationInsights() {
  return (
    <>
      <h3>
        Optimization
        Insights
      </h3>

      <div className="analytics-insight-list">

        <article className="analytics-insight-item">
          <strong>
            Peak Demand
          </strong>

          <p>
            Energy demand is
            expected to peak
            between 18:00 and
            21:00.
          </p>
        </article>

        <article className="analytics-insight-item">
          <strong>
            Recommendation
          </strong>

          <p>
            Shift flexible EV
            sessions to late
            evening charging.
          </p>
        </article>

        <article className="analytics-insight-item">
          <strong>
            Potential Saving
          </strong>

          <p>
            Estimated additional
            saving:
            <b> 32.4 kWh</b>
          </p>
        </article>

      </div>
    </>
  );
}