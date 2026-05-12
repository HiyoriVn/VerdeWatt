// src/pages/Allocation.jsx

import AllocationSummary from "../components/dashboard/AllocationSummary";
import ScheduleRecommendations from "../components/charging/ScheduleRecommendations";

export default function Allocation() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Smart Allocation</h1>

          <p>
            AI charging optimization and
            energy balancing
          </p>
        </div>
      </header>

      <div className="dashboard-stack">
        <AllocationSummary />

        <section className="card glass-card">
          <div className="section-header">
            <div>
              <h3>
                Schedule Recommendations
              </h3>

              <p className="muted-text">
                Suggested charging windows
              </p>
            </div>
          </div>

          <ScheduleRecommendations />
        </section>
      </div>
    </div>
  );
}