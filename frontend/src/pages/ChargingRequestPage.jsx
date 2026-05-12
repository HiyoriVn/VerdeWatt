import { useState } from "react";

import { submitChargingRequest } from "../services/api";

const INITIAL_FORM = {
  vehicle_id: "EV_TEST_01",
  current_soc: 25,
  target_soc: 80,
  battery_kwh: 60,
  deadline_hour: 7,
  preference: "balanced",
};

export default function ChargingRequestPage({
  onBackToLanding,
  onOpenDashboard,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "vehicle_id" || name === "preference"
          ? value
          : Number(value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = await submitChargingRequest(form);
      setResult(payload);
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Unable to submit charging request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Charging Request</h1>
          <p>Submit one EV charging request and get a smart recommendation.</p>
        </div>
      </header>

      <section className="card glass-card">
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "14px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <label>
            Vehicle ID
            <input
              className="vehicle-input"
              name="vehicle_id"
              value={form.vehicle_id}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Current SOC
            <input
              className="vehicle-input"
              type="number"
              min="0"
              max="100"
              name="current_soc"
              value={form.current_soc}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Target SOC
            <input
              className="vehicle-input"
              type="number"
              min="0"
              max="100"
              name="target_soc"
              value={form.target_soc}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Battery (kWh)
            <input
              className="vehicle-input"
              type="number"
              min="1"
              name="battery_kwh"
              value={form.battery_kwh}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Deadline Hour
            <input
              className="vehicle-input"
              type="number"
              min="0"
              max="23"
              name="deadline_hour"
              value={form.deadline_hour}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Preference
            <select
              className="vehicle-input"
              name="preference"
              value={form.preference}
              onChange={handleInputChange}
            >
              <option value="fastest">fastest</option>
              <option value="cheapest">cheapest</option>
              <option value="balanced">balanced</option>
            </select>
          </label>

          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              className="vehicle-search-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

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
        </form>

        {error ? (
          <p className="vehicle-error" style={{ marginTop: "16px" }}>
            Unable to submit charging request: {error}
          </p>
        ) : null}
      </section>

      {result ? (
        <section className="card glass-card">
          <h3>Recommendation</h3>
          <div className="vehicle-result-grid">
            <div className="vehicle-info-item">
              <span>Status</span>
              <strong>{result.status ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Recommended Action</span>
              <strong>{result.recommended_action ?? "N/A"}</strong>
            </div>
            <div className="vehicle-info-item">
              <span>Scheduled Start Hour</span>
              <strong>{result.scheduled_start_hour ?? "N/A"}</strong>
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
