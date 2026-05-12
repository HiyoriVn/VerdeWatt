// src/pages/Billing.jsx

import KPICards from "../components/dashboard/KPICards";

export default function Billing() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Billing & Energy</h1>

          <p>
            Energy usage insights and
            billing simulation
          </p>
        </div>
      </header>

      <KPICards />
    </div>
  );
}