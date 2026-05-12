// src/pages/Security.jsx

import SecurityAlertFeed from "../components/security/SecurityAlertFeed";
import ChargerCommandPanel from "../components/security/ChargerCommandPanel";

export default function Security() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Security Center</h1>

          <p>
            Security monitoring and
            charger diagnostics
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <SecurityAlertFeed alerts={[]} />
        </div>

        <div className="dashboard-side">
          <section className="card glass-card">
            <ChargerCommandPanel />
          </section>
        </div>
      </div>
    </div>
  );
}