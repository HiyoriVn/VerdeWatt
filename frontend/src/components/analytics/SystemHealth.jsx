export default function SystemHealth() {
  return (
    <>
      <h3>
        System Health
      </h3>

      <div className="analytics-health-list">

        <div className="health-item">
          <span>
            Grid Stability
          </span>

          <strong>
            Healthy
          </strong>
        </div>

        <div className="health-item">
          <span>
            Charging Risk
          </span>

          <strong>
            Low
          </strong>
        </div>

        <div className="health-item">
          <span>
            Forecast Confidence
          </span>

          <strong>
            94%
          </strong>
        </div>

      </div>
    </>
  );
}