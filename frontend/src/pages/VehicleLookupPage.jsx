import { useState } from "react";

import { getVehicle } from "../services/api";

export default function VehicleLookupPage({
  onBackToLanding,
  onOpenDashboard,
}) {
  const [vehicleId, setVehicleId] = useState("EV_001");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = await getVehicle(vehicleId.trim());
      setResult(payload);
    } catch (requestError) {
      const message = requestError?.message || "";
      if (
        message.toLowerCase().includes("vehicle code not found")
      ) {
        setError("Vehicle code not found.");
      } else {
        setError(
          "Unable to check vehicle status right now. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Vehicle Lookup</h1>
          <p>Check charging status by vehicle code.</p>
        </div>
      </header>

      <section className="card glass-card">
        <form className="vehicle-search-bar" onSubmit={handleSearch}>
          <input
            className="vehicle-input"
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            placeholder="EV_001"
            required
          />

          <button
            type="submit"
            className="vehicle-search-btn"
            disabled={loading}
          >
            {loading ? "Searching..." : "Check Status"}
          </button>
        </form>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onBackToLanding}
          >
            Back to Landing
          </button>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onOpenDashboard}
          >
            Open Building Dashboard
          </button>
        </div>

        {error ? (
          <p className="vehicle-error" style={{ marginTop: "14px" }}>
            {error}
          </p>
        ) : null}
      </section>

      {result ? (
        <section className="vehicle-result-card">
          <div className="vehicle-result-header">
            <div>
              <h3>{result.vehicle_id}</h3>
              <p>Current vehicle recommendation</p>
            </div>
          </div>

          <div className="vehicle-result-grid">
            <div className="vehicle-info-item">
              <span>Current SOC</span>
              <strong>{result.current_soc ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Target SOC</span>
              <strong>{result.target_soc ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Priority</span>
              <strong>{result.priority ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Status</span>
              <strong>{result.status ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Recommended Action</span>
              <strong>{result.recommended_action ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Estimated Completion Hour</span>
              <strong>{result.estimated_completion_hour ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Estimated Cost (VND)</span>
              <strong>{result.estimated_cost_vnd ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Estimated Saving (VND)</span>
              <strong>{result.estimated_saving_vnd ?? "N/A"}</strong>
            </div>
          </div>

          <div className="vehicle-message-box">
            <strong>User Message</strong>
            <p>{result.user_message ?? "No message available."}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
