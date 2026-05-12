const NAV_LINKS = [
  { id: "solution", label: "Solution" },
  { id: "benefits", label: "Benefits" },
  { id: "how-it-works", label: "How it works" },
  { id: "green-impact", label: "Green Impact" },
  { id: "security", label: "Security" },
];

const PROBLEM_CARDS = [
  {
    title: "Evening peak overload",
    text: "Many EVs begin charging at the same time during evening demand spikes.",
  },
  {
    title: "Limited building capacity",
    text: "High-rise electrical systems have fixed safe operating limits during peak hours.",
  },
  {
    title: "Safety and cost risks",
    text: "Unmanaged charging can raise overload risk and increase avoidable energy costs.",
  },
];

const SOLUTION_CARDS = [
  "ML load forecasting",
  "Smart charging scheduling",
  "Cost optimization",
  "Security anomaly detection",
];

const HOW_IT_WORKS = [
  "Resident submits charging request",
  "VerdeWatt forecasts building load",
  "System schedules charging safely",
  "Staff monitors dashboard and alerts",
];

export default function LandingPage({
  onOpenChargingPortal,
  onOpenStaffLogin,
}) {
  function handleScrollTo(sectionId) {
    const element = window.document.getElementById(sectionId);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="public-page landing-page">
      <header className="public-header card glass-card">
        <div className="public-logo">
          <span>VerdeWatt</span>
        </div>

        <nav className="public-nav">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleScrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="public-header-actions">
          <button
            type="button"
            className="public-button public-button-ghost"
            onClick={onOpenChargingPortal}
          >
            Charging Portal
          </button>
          <button
            type="button"
            className="public-button public-button-primary"
            onClick={onOpenStaffLogin}
          >
            Staff Login
          </button>
        </div>
      </header>

      <section className="hero-section card glass-card">
        <p className="portal-eyebrow">Urban EV infrastructure</p>
        <h1>Safe, smart EV charging for urban buildings.</h1>
        <p>
          VerdeWatt helps apartments and residential communities schedule EV
          charging safely, reduce peak overload, lower charging costs, and
          monitor abnormal charging behavior.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="public-button public-button-primary"
            onClick={onOpenChargingPortal}
          >
            Check or Schedule My EV
          </button>
          <button
            type="button"
            className="public-button public-button-ghost"
            onClick={onOpenStaffLogin}
          >
            For Building Managers
          </button>
        </div>
      </section>

      <section className="public-section" id="problem">
        <div className="section-title-wrap">
          <h2>Problem</h2>
          <p>
            High-rise buildings face evening peaks where unmanaged charging can
            push total demand past safe limits.
          </p>
        </div>
        <div className="public-card-grid public-card-grid-3">
          {PROBLEM_CARDS.map((card) => (
            <article key={card.title} className="card glass-card public-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section" id="solution">
        <div className="section-title-wrap">
          <h2>Solution</h2>
          <p>
            VerdeWatt combines forecasting, rule-based scheduling, billing
            simulation, and cyber safety checks in one workflow.
          </p>
        </div>
        <div className="public-card-grid public-card-grid-4">
          {SOLUTION_CARDS.map((title) => (
            <article key={title} className="card glass-card public-card">
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section" id="benefits">
        <div className="section-title-wrap">
          <h2>Benefits</h2>
        </div>
        <div className="public-card-grid public-card-grid-3">
          <article className="card glass-card public-card">
            <h3>For Residents</h3>
            <ul>
              <li>Check charging status by vehicle code</li>
              <li>Charge-ready before deadline planning</li>
              <li>Lower estimated charging costs</li>
            </ul>
          </article>

          <article className="card glass-card public-card">
            <h3>For Building Managers</h3>
            <ul>
              <li>Avoid overload with safe allocation</li>
              <li>Monitor charger and EV activity</li>
              <li>Schedule charging with clear recommendations</li>
            </ul>
          </article>

          <article className="card glass-card public-card">
            <h3>For Communities</h3>
            <ul>
              <li>Support EV adoption in dense buildings</li>
              <li>Reduce local peak stress on shared infrastructure</li>
              <li>Improve confidence in urban charging operations</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="public-section" id="how-it-works">
        <div className="section-title-wrap">
          <h2>How it works</h2>
        </div>
        <div className="public-card-grid public-card-grid-4">
          {HOW_IT_WORKS.map((step, index) => (
            <article key={step} className="card glass-card public-card">
              <p className="step-index">Step {index + 1}</p>
              <h3>{step}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section" id="green-impact">
        <div className="section-title-wrap">
          <h2>Green Impact</h2>
        </div>
        <div className="public-card-grid public-card-grid-3">
          <article className="card glass-card public-card impact-highlight">
            <p>Shifted kWh</p>
            <strong>278 kWh</strong>
          </article>

          <article className="card glass-card public-card impact-highlight">
            <p>CO2 avoided</p>
            <strong>115 kg</strong>
          </article>

          <article className="card glass-card public-card impact-highlight">
            <p>Estimated savings</p>
            <strong>1,540,000 VND</strong>
          </article>
        </div>
      </section>

      <section className="public-section" id="security">
        <div className="section-title-wrap">
          <h2>Security</h2>
          <p>
            Rule-based monitoring catches unusual behavior quickly and supports
            safer operator response.
          </p>
        </div>
        <div className="public-card-grid public-card-grid-3">
          <article className="card glass-card public-card">
            <h3>Abnormal power request detection</h3>
            <p>
              Flag requests with unusual current/power profiles for manual
              validation.
            </p>
          </article>

          <article className="card glass-card public-card">
            <h3>Charger offline detection</h3>
            <p>
              Identify unavailable chargers and highlight potential DoS-like
              behavior.
            </p>
          </article>

          <article className="card glass-card public-card">
            <h3>Mock OCPP-compatible control command</h3>
            <p>
              Simulated operator commands support safe demonstration of control
              workflows.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
