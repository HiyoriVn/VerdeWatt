// src/pages/Analytics.jsx

import ForecastChart from "../components/analytics/ForecastChart";
import ImpactCards from "../components/analytics/ImpactCards";

export default function Analytics() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Analytics</h1>

          <p>
            Energy forecasting and
            sustainability impact
          </p>
        </div>
      </header>

      <div className="dashboard-stack">
        <section className="card glass-card">
          <ForecastChart />
        </section>

        <section className="card glass-card">
          <ImpactCards />
        </section>
      </div>
    </div>
  );
}