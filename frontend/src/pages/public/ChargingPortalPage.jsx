import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft, ChevronRight, Home, ShieldAlert } from "lucide-react";
import {
  getVehicle,
  submitChargingRequest,
} from "../../services/api";
import screen1Image from "../../assets/landingpage/screen1.png";

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

export default function ChargingPortalPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = ["register", "status", "staff"].includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "register";
  const [portalTab, setPortalTab] = useState(initialTab);

  // Input states
  const [vehicleId, setVehicleId] = useState("EV_001");
  const [vehicleResult, setVehicleResult] = useState(null);
  const [vehicleError, setVehicleError] = useState("");
  const [vehicleLoading, setVehicleLoading] = useState(false);

  const [form, setForm] = useState({
    vehicle_id: "",
    current_soc: "",
    target_soc: "",
    battery_kwh: "",
    deadline_hour: "",
    preference: "balanced"
  });
  const [requestResult, setRequestResult] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  // Staff login states
  const [staffForm, setStaffForm] = useState({
    email: "",
    password: "",
    buildingCode: "VDW_TOWER_01",
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]:
        name === "vehicle_id" || name === "preference"
          ? value
          : value === "" ? "" : Number(value),
    }));
  }

  function handleStaffInputChange(event) {
    const { name, value } = event.target;
    setStaffForm((current) => ({
      ...current,
      [name]: value,
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
      setVehicleError(
        error?.message || "Unable to check vehicle status right now."
      );
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
        error?.message || "Unable to submit charging request. Please try again."
      );
    } finally {
      setRequestLoading(false);
    }
  }

  function handleStaffSubmit(event) {
    event.preventDefault();
    if (!staffForm.email.trim() || !staffForm.password.trim()) {
      return;
    }
    const profile = {
      email: staffForm.email.trim(),
      buildingCode: staffForm.buildingCode.trim(),
      role: "Building Manager",
    };
    if (onLoginSuccess) {
      onLoginSuccess(profile);
    }
    navigate("/dashboard");
  }

  return (
    <div className="public-page portal-page">
      <div className="portal-card">
        {/* Left Side: Dynamic Forms */}
        <div className="portal-card-left">
          <div>
            {/* Header Title based on Active Tab */}
            <div className="portal-header">
              {portalTab === "register" && (
                <>
                  <h1 className="portal-header-title">Register Charging</h1>
                  <p className="portal-header-subtitle">Let's schedule a smart charging session for your EV</p>
                </>
              )}
              {portalTab === "status" && (
                <>
                  <h1 className="portal-header-title">Check EV Status</h1>
                  <p className="portal-header-subtitle">Track your real-time charging status & estimated outcomes</p>
                </>
              )}
              {portalTab === "staff" && (
                <>
                  <h1 className="portal-header-title">Operator Access</h1>
                  <p className="portal-header-subtitle">Access your staff dashboard for operations monitoring</p>
                </>
              )}
            </div>

            {/* Custom Pill Tabs */}
            <div className="portal-pill-tabs">
              <button
                type="button"
                className={`portal-pill-tab ${portalTab === "register" ? "active" : ""}`}
                onClick={() => setPortalTab("register")}
              >
                Register
              </button>
              <button
                type="button"
                className={`portal-pill-tab ${portalTab === "status" ? "active" : ""}`}
                onClick={() => setPortalTab("status")}
              >
                Check Status
              </button>
              <button
                type="button"
                className={`portal-pill-tab ${portalTab === "staff" ? "active" : ""}`}
                onClick={() => setPortalTab("staff")}
              >
                Operator Login
              </button>
            </div>

            {/* Form rendering */}
            {portalTab === "register" && (
              <form onSubmit={handleChargingRequest} className="portal-custom-form">
                <div className="portal-input-group">
                  <span className="portal-input-label">Vehicle ID</span>
                  <input
                    className="portal-input"
                    name="vehicle_id"
                    value={form.vehicle_id}
                    onChange={handleInputChange}
                    placeholder="e.g. EV_001"
                    required
                  />
                </div>

                <div className="portal-form-row">
                  <div className="portal-input-group">
                    <span className="portal-input-label">Current SOC (%)</span>
                    <input
                      className="portal-input"
                      type="number"
                      min="0"
                      max="100"
                      name="current_soc"
                      value={form.current_soc}
                      onChange={handleInputChange}
                      placeholder="e.g. 20"
                      required
                    />
                  </div>
                  <div className="portal-input-group">
                    <span className="portal-input-label">Target SOC (%)</span>
                    <input
                      className="portal-input"
                      type="number"
                      min="0"
                      max="100"
                      name="target_soc"
                      value={form.target_soc}
                      onChange={handleInputChange}
                      placeholder="e.g. 85"
                      required
                    />
                  </div>
                </div>

                <div className="portal-form-row">
                  <div className="portal-input-group">
                    <span className="portal-input-label">Battery (kWh)</span>
                    <input
                      className="portal-input"
                      type="number"
                      min="1"
                      name="battery_kwh"
                      value={form.battery_kwh}
                      onChange={handleInputChange}
                      placeholder="e.g. 75"
                      required
                    />
                  </div>
                  <div className="portal-input-group">
                    <span className="portal-input-label">Deadline Hour</span>
                    <input
                      className="portal-input"
                      type="number"
                      min="0"
                      max="23"
                      name="deadline_hour"
                      value={form.deadline_hour}
                      onChange={handleInputChange}
                      placeholder="e.g. 7"
                      required
                    />
                  </div>
                </div>

                <div className="portal-input-group">
                  <span className="portal-input-label">Preference</span>
                  <select
                    className="portal-input"
                    name="preference"
                    value={form.preference}
                    onChange={handleInputChange}
                  >
                    <option value="fastest">fastest</option>
                    <option value="cheapest">cheapest</option>
                    <option value="balanced">balanced</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="portal-submit-btn"
                  disabled={requestLoading}
                >
                  {requestLoading ? "Submitting..." : "Submit Request"}
                </button>

                {requestError && <p className="vehicle-error">{requestError}</p>}

                {requestResult && (
                  <div className="portal-card-results">
                    <h4 className="portal-results-title">Charging Schedule</h4>
                    <div className="portal-results-grid">
                      <div className="portal-result-item">
                        <span>Status</span>
                        <strong>{requestResult.status ?? "N/A"}</strong>
                      </div>
                      <div className="portal-result-item">
                        <span>Start Hour</span>
                        <strong>{formatHour(requestResult.scheduled_start_hour)}</strong>
                      </div>
                      <div className="portal-result-item">
                        <span>Est. Cost</span>
                        <strong>{formatVnd(requestResult.estimated_cost_vnd)}</strong>
                      </div>
                    </div>
                    <div className="portal-result-action">
                      <span>Recommended Action</span>
                      <p>{requestResult.recommended_action ?? "N/A"}</p>
                    </div>
                    <div className="portal-result-action">
                      <span>Summary</span>
                      <p>{requestResult.user_message ?? "N/A"}</p>
                    </div>
                  </div>
                )}
              </form>
            )}

            {portalTab === "status" && (
              <form onSubmit={handleVehicleSearch} className="portal-custom-form">
                <div className="portal-input-group">
                  <span className="portal-input-label">Vehicle ID</span>
                  <input
                    className="portal-input"
                    value={vehicleId}
                    onChange={(event) => setVehicleId(event.target.value)}
                    placeholder="EV_001"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="portal-submit-btn"
                  disabled={vehicleLoading}
                >
                  {vehicleLoading ? "Checking..." : "Check Status"}
                </button>

                {vehicleError && <p className="vehicle-error">{vehicleError}</p>}

                {vehicleResult && (
                  <div className="portal-card-results">
                    <h4 className="portal-results-title">Vehicle Status</h4>
                    <div className="portal-results-grid">
                      <div className="portal-result-item">
                        <span>Status</span>
                        <strong>{vehicleResult.status ?? "N/A"}</strong>
                      </div>
                      <div className="portal-result-item">
                        <span>Completion</span>
                        <strong>{formatHour(vehicleResult.estimated_completion_hour)}</strong>
                      </div>
                      <div className="portal-result-item">
                        <span>Cost</span>
                        <strong>{formatVnd(vehicleResult.estimated_cost_vnd)}</strong>
                      </div>
                    </div>
                    <div className="portal-result-action">
                      <span>Savings</span>
                      <p>{formatVnd(vehicleResult.estimated_saving_vnd)}</p>
                    </div>
                    <div className="portal-result-action">
                      <span>Status Message</span>
                      <p>{vehicleResult.user_message ?? "N/A"}</p>
                    </div>
                  </div>
                )}
              </form>
            )}

            {portalTab === "staff" && (
              <form onSubmit={handleStaffSubmit} className="portal-custom-form">
                <div className="portal-input-group">
                  <span className="portal-input-label">Work Email</span>
                  <input
                    className="portal-input"
                    type="email"
                    name="email"
                    value={staffForm.email}
                    onChange={handleStaffInputChange}
                    placeholder="you@building-management.vn"
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="portal-input-group">
                  <span className="portal-input-label">Password</span>
                  <div className="portal-input-password-wrapper">
                    <input
                      className="portal-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={staffForm.password}
                      onChange={handleStaffInputChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="portal-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="portal-input-group">
                  <span className="portal-input-label">Building Code</span>
                  <input
                    className="portal-input"
                    name="buildingCode"
                    value={staffForm.buildingCode}
                    onChange={handleStaffInputChange}
                    placeholder="e.g. VDW_TOWER_01"
                    required
                  />
                </div>

                <button type="submit" className="portal-submit-btn">
                  Sign in to Dashboard
                </button>
              </form>
            )}
          </div>

          {/* Back link */}
          <div>
            <p className="portal-footer-link">
              Need assistance?{" "}
              <button
                type="button"
                style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", color: "#4a8c30", fontWeight: "bold", textDecoration: "underline" }}
                onClick={() => navigate("/")}
              >
                Back to home
              </button>
            </p>
          </div>
        </div>

        {/* Right Side: Portrait Image Cover with warm gradient overlay */}
        <div className="portal-card-right">
          <img src={screen1Image} alt="VerdeWatt Smart Charging Scene" />
          <div className="portal-card-right-overlay" />
          <div className="portal-card-right-controls">
            <button type="button" className="portal-card-right-btn" aria-label="Previous illustration">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="portal-card-right-btn" aria-label="Next illustration">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
