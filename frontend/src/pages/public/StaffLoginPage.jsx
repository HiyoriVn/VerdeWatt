import { useState } from "react";

const DEMO_EMAIL = "admin@verdewatt.vn";
const DEMO_PASSWORD = "demo123";

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
    <div className="public-page">
      <section className="staff-login-shell">
        <div className="staff-login-copy">
          <p className="portal-eyebrow">
            Internal access
          </p>
          <h1>Staff Login</h1>
          <p>
            This prototype login uses local demo state for
            MVP flows. No real authentication or credential
            storage is used.
          </p>

          <div className="staff-login-hint">
            <strong>Demo account</strong>
            <p>
              admin@verdewatt.vn / demo123
            </p>
          </div>
        </div>

        <form
          className="card glass-card staff-login-form"
          onSubmit={handleSubmit}
        >
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
            <button
              type="button"
              className="public-button public-button-ghost"
              onClick={onBackToLanding}
            >
              Back to Landing
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
