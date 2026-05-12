import { useState } from "react";

import {
  getVehicle,
  submitChargingRequest,
} from "../services/api";

const INITIAL_FORM = {
  vehicle_id: "EV_001",
  current_soc: 25,
  target_soc: 80,
  battery_kwh: 60,
  deadline_hour: 7,
  preference: "balanced",
};

export default function ChargingPortalPage({
  onBackToLanding,
  onOpenStaffLogin,
}) {
  const [portalTab, setPortalTab] = useState("guest");

  const [vehicleId, setVehicleId] = useState("EV_001");
  const [vehicleResult, setVehicleResult] = useState(null);
  const [vehicleError, setVehicleError] = useState("");
  const [vehicleLoading, setVehicleLoading] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);
  const [requestResult, setRequestResult] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [requestLoading, setRequestLoading] =
    useState(false);

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

  async function handleVehicleSearch(event) {
    event.preventDefault();
    setVehicleLoading(true);
    setVehicleError("");
    setVehicleResult(null);

    try {
      const payload = await getVehicle(vehicleId.trim());
      setVehicleResult(payload);
    } catch (error) {
      const message =
        error?.message ||
        "Unable to check vehicle status right now. Please try again.";
      setVehicleError(message);
    } finally {
      setVehicleLoading(false);
    }
  }

  async function handleChargingRequest(event) {
    event.preventDefault();
    setRequestLoading(true);
    setRequestError("");
    setRequestResult(null);

    try {
      const payload = await submitChargingRequest(form);
      setRequestResult(payload);
    } catch (error) {
      setRequestError(
        error?.message ||
          "Unable to submit charging request. Please try again."
      );
    } finally {
      setRequestLoading(false);
    }
  }

  return (
    <div className="public-page">
      <section className="portal-hero">
        <div>
          <p className="portal-eyebrow">
            Resident and guest access
          </p>
          <h1>Charging Portal</h1>
          <p>
            Check your current charging recommendation or
            submit a new request for safe scheduling.
          </p>
        </div>

        <button
          type="button"
          className="public-button public-button-ghost"
          onClick={onBackToLanding}
        >
          Back to Landing
        </button>
      </section>

      <section className="portal-tabs">
        <button
          type="button"
          className={`portal-tab-btn ${
            portalTab === "guest"
              ? "portal-tab-btn-active"
              : ""
          }`}
          onClick={() => setPortalTab("guest")}
        >
          Guest Charging
        </button>

        <button
          type="button"
          className={`portal-tab-btn ${
            portalTab === "staff"
              ? "portal-tab-btn-active"
              : ""
          }`}
          onClick={() => setPortalTab("staff")}
        >
          Staff Access
        </button>
      </section>

      {portalTab === "guest" ? (
        <div className="portal-grid">
          <section className="card glass-card">
            <div className="section-title-wrap">
              <h3>Check My Vehicle</h3>
              <p>
                Enter your vehicle code to get status,
                completion estimate, and cost guidance.
              </p>
            </div>

            <form
              className="vehicle-search-bar"
              onSubmit={handleVehicleSearch}
            >
              <input
                className="vehicle-input"
                value={vehicleId}
                onChange={(event) =>
                  setVehicleId(event.target.value)
                }
                placeholder="EV_001"
                required
              />

              <button
                type="submit"
                className="vehicle-search-btn"
                disabled={vehicleLoading}
              >
                {vehicleLoading
                  ? "Checking..."
                  : "Check Status"}
              </button>
            </form>

            {vehicleError ? (
              <p className="vehicle-error">
                {vehicleError}
              </p>
            ) : null}

            {vehicleResult ? (
              <div className="vehicle-result-grid">
                <div className="vehicle-info-item">
                  <span>Status</span>
                  <strong>
                    {vehicleResult.status ?? "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Recommended Action</span>
                  <strong>
                    {vehicleResult.recommended_action ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Completion Hour</span>
                  <strong>
                    {vehicleResult.estimated_completion_hour ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Cost (VND)</span>
                  <strong>
                    {vehicleResult.estimated_cost_vnd ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Saving (VND)</span>
                  <strong>
                    {vehicleResult.estimated_saving_vnd ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>User Message</span>
                  <strong>
                    {vehicleResult.user_message ?? "N/A"}
                  </strong>
                </div>
              </div>
            ) : null}
          </section>

          <section className="card glass-card">
            <div className="section-title-wrap">
              <h3>Register Charging Request</h3>
              <p>
                Submit charging details and receive a safe
                recommendation from VerdeWatt.
              </p>
            </div>

            <form
              onSubmit={handleChargingRequest}
              className="portal-form-grid"
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
                  <option value="fastest">
                    fastest
                  </option>
                  <option value="cheapest">
                    cheapest
                  </option>
                  <option value="balanced">
                    balanced
                  </option>
                </select>
              </label>

              <div className="portal-form-actions">
                <button
                  type="submit"
                  className="vehicle-search-btn"
                  disabled={requestLoading}
                >
                  {requestLoading
                    ? "Submitting..."
                    : "Submit Request"}
                </button>
              </div>
            </form>

            {requestError ? (
              <p className="vehicle-error">
                {requestError}
              </p>
            ) : null}

            {requestResult ? (
              <div className="vehicle-result-grid">
                <div className="vehicle-info-item">
                  <span>Status</span>
                  <strong>
                    {requestResult.status ?? "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Recommended Action</span>
                  <strong>
                    {requestResult.recommended_action ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Scheduled Start Hour</span>
                  <strong>
                    {requestResult.scheduled_start_hour ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Completion Hour</span>
                  <strong>
                    {requestResult.estimated_completion_hour ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Cost (VND)</span>
                  <strong>
                    {requestResult.estimated_cost_vnd ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Saving (VND)</span>
                  <strong>
                    {requestResult.estimated_saving_vnd ??
                      "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>User Message</span>
                  <strong>
                    {requestResult.user_message ?? "N/A"}
                  </strong>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      ) : (
        <section className="card glass-card staff-access-card">
          <h3>Staff Access</h3>
          <p className="muted-text">
            Building managers and operations staff can
            continue to the internal dashboard login.
          </p>
          <button
            type="button"
            className="vehicle-search-btn"
            onClick={onOpenStaffLogin}
          >
            Go to Staff Login
          </button>
        </section>
      )}
    </div>
  );
}
