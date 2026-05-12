import { useState } from "react";

const DEMO_EMAIL = "admin@verdewatt.vn";
const DEMO_PASSWORD = "demo123";

const TRUST_POINTS = [
  "Forecast-aware charging allocation for peak windows",
  "Rule-based safety checks with explainable alerts",
  "Resident portal + operator dashboard in one workflow",
];

export default function StaffLoginPage({
  onBackToLanding,
  onLoginSuccess,
}) {
  const [form, setForm] = useState({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    buildingCode: "VDW_TOWER_01",
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
      setError("Please fill all fields.");
      return;
    }

    setError("");

    onLoginSuccess({
      email: form.email.trim(),
      buildingCode: form.buildingCode.trim(),
    });
  }

  return (
    <div className="public-page staff-login-page">
      <section className="staff-login-shell">
        <div className="staff-login-copy">
          <p className="public-chip">Operator portal</p>
          <h1>Building operations login</h1>
          <p>
            Access the VerdeWatt staff dashboard to monitor charging sessions,
            forecasted demand, and operational alerts.
          </p>

          <ul className="staff-benefits-list">
            {TRUST_POINTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <button
            type="button"
            className="public-button public-button-ghost"
            onClick={onBackToLanding}
          >
            Back to Landing
          </button>
        </div>

        <form
          className="staff-login-form public-panel"
          onSubmit={handleSubmit}
        >
          <h3>Sign in</h3>
          <p className="muted-text">
            Use your operator account to continue.
          </p>

          <label>
            Staff email
            <input
              className="vehicle-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              required
            />
          </label>

          {error ? (
            <p className="vehicle-error">{error}</p>
          ) : null}

          <div className="staff-login-actions">
            <button
              type="submit"
              className="vehicle-search-btn"
            >
              Enter Dashboard
            </button>
          </div>

          <p className="demo-note">
            Demo credentials: {DEMO_EMAIL} / {DEMO_PASSWORD}
          </p>
        </form>
      </section>
    </div>
  );
}
