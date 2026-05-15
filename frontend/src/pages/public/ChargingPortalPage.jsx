import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getVehicle,
  submitChargingRequest,
} from "../../services/api";

const INITIAL_FORM = {
  vehicle_id: "EV_001",
  current_soc: 25,
  target_soc: 80,
  battery_kwh: 60,
  deadline_hour: 7,
  preference: "balanced",
};

function formatVnd(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "N/A";
  }

  return `${amount.toLocaleString("vi-VN")} VND`;
}

function formatHour(value) {
  const hour = Number(value);

  if (!Number.isFinite(hour)) {
    return "N/A";
  }

  return `${hour}:00`;
}

export default function ChargingPortalPage() {
  const navigate = useNavigate();
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
    <div className="public-page portal-page">
      <section className="portal-hero">
        <div>
          <p className="public-chip">Resident portal</p>
          <h1>Check EV status or submit a charging request.</h1>
          <p>
            Form-first flow for residents and guest drivers, with clear
            recommendations from VerdeWatt scheduling logic.
          </p>
        </div>

        <button
          type="button"
          className="public-button public-button-ghost"
          onClick={() => navigate("/")}
        >
          Back to home
        </button>
      </section>

      <section className="portal-tabs" aria-label="Portal mode">
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
          <section className="public-panel">
            <div className="section-title-wrap">
              <h3>Register Charging Request</h3>
              <p>
                Submit your charging needs and receive a safe schedule
                recommendation.
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
                Current SOC (%)
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
                Target SOC (%)
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
              <p className="vehicle-error">{requestError}</p>
            ) : null}

            {requestResult ? (
              <div className="portal-result-grid">
                <div className="vehicle-info-item">
                  <span>Status</span>
                  <strong>{requestResult.status ?? "N/A"}</strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Recommended Action</span>
                  <strong>
                    {requestResult.recommended_action ?? "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Scheduled Start</span>
                  <strong>
                    {formatHour(requestResult.scheduled_start_hour)}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Completion</span>
                  <strong>
                    {formatHour(requestResult.estimated_completion_hour)}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Cost</span>
                  <strong>
                    {formatVnd(requestResult.estimated_cost_vnd)}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Saving</span>
                  <strong>
                    {formatVnd(requestResult.estimated_saving_vnd)}
                  </strong>
                </div>
                <div className="vehicle-info-item portal-result-message">
                  <span>User Message</span>
                  <strong>{requestResult.user_message ?? "N/A"}</strong>
                </div>
              </div>
            ) : null}
          </section>

          <section className="public-panel">
            <div className="section-title-wrap">
              <h3>Check My Vehicle</h3>
              <p>
                Enter your vehicle code to review current status and expected
                charging outcome.
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
              <p className="vehicle-error">{vehicleError}</p>
            ) : null}

            {vehicleResult ? (
              <div className="portal-result-grid">
                <div className="vehicle-info-item">
                  <span>Status</span>
                  <strong>{vehicleResult.status ?? "N/A"}</strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Recommended Action</span>
                  <strong>
                    {vehicleResult.recommended_action ?? "N/A"}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Completion</span>
                  <strong>
                    {formatHour(vehicleResult.estimated_completion_hour)}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Cost</span>
                  <strong>
                    {formatVnd(vehicleResult.estimated_cost_vnd)}
                  </strong>
                </div>
                <div className="vehicle-info-item">
                  <span>Estimated Saving</span>
                  <strong>
                    {formatVnd(vehicleResult.estimated_saving_vnd)}
                  </strong>
                </div>
                <div className="vehicle-info-item portal-result-message">
                  <span>User Message</span>
                  <strong>{vehicleResult.user_message ?? "N/A"}</strong>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      ) : (
        <section className="public-panel staff-access-card">
          <p className="public-chip">Operator access</p>
          <h3>Staff access for building operations teams</h3>
          <p className="muted-text">
            Building managers can continue to the internal dashboard login for
            demand monitoring, allocation, and security alerts.
          </p>
          <button
            type="button"
            className="vehicle-search-btn"
            onClick={() => navigate("/login")}
          >
            Go to Staff Login
          </button>
        </section>
      )}
    </div>
  );
}
