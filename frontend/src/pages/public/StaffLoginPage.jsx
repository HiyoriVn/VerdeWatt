import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TRUST_POINTS = [
  "Forecast-aware charging allocation for peak windows",
  "Rule-based safety checks with clear operator guidance",
  "Resident portal and operations dashboard in one platform",
];

export default function StaffLoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    buildingCode: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.email.trim() ||
      !form.password.trim() ||
      !form.buildingCode.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");

    onLoginSuccess({
      email: form.email.trim(),
      buildingCode: form.buildingCode.trim(),
      role: "Building Manager",
    });
    navigate("/dashboard");
  }

  return (
    <div className="public-page staff-login-page">
      <section className="staff-login-shell">
        <div className="staff-login-copy">
          <p className="public-chip">Operator portal</p>
          <h1>Sign in to your building dashboard</h1>
          <p>
            Monitor charging sessions, manage peak load, and review security
            alerts for your property.
          </p>

          <ul className="staff-benefits-list">
            {TRUST_POINTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <button
            type="button"
            className="public-button public-button-ghost"
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
        </div>

        <form
          className="staff-login-form public-panel"
          onSubmit={handleSubmit}
        >
          <h3>Operator sign in</h3>
          <p className="muted-text">
            Use the credentials provided by your property manager or VerdeWatt
            onboarding team.
          </p>

          <label>
            Work email
            <input
              className="vehicle-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@building-management.vn"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              className="vehicle-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <label>
            Building code
            <input
              className="vehicle-input"
              name="buildingCode"
              value={form.buildingCode}
              onChange={handleChange}
              placeholder="e.g. VDW_TOWER_01"
              required
            />
          </label>

          {error ? <p className="vehicle-error">{error}</p> : null}

          <div className="staff-login-actions">
            <button type="submit" className="vehicle-search-btn">
              Sign in
            </button>
          </div>

          <p className="staff-login-help">
            Need access? Contact your building administrator or{" "}
            <a href="mailto:hello@verdewatt.com">hello@verdewatt.com</a>.
          </p>
        </form>
      </section>
    </div>
  );
}
