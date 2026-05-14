import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "benefits", label: "Benefits" },
  { id: "how-it-works", label: "How it works" },
  { id: "green-impact", label: "Green Impact" },
  { id: "security", label: "Security" },
];

const PROBLEM_CARDS = [
  {
    tag: "Peak hours",
    title: "Evening charging spikes overload shared infrastructure",
    text: "When many residents plug in between 18:00 and 22:00, unmanaged demand can exceed safe building capacity.",
  },
  {
    tag: "Operations",
    title: "Managers lack clear prioritization during congestion",
    text: "Without a scheduling layer, staff cannot quickly decide which sessions should charge now versus later.",
  },
  {
    tag: "Cost + safety",
    title: "Poor timing increases risk and avoidable energy cost",
    text: "Uncoordinated charging raises overload risk and misses opportunities to shift flexible demand.",
  },
];

const SOLUTION_CARDS = [
  {
    tag: "Forecasting",
    title: "AI load forecast",
    text: "Estimate near-term demand before peak windows arrive.",
  },
  {
    tag: "Scheduling",
    title: "Rule-based allocation",
    text: "Distribute charging power by priority, deadline, and safe limits.",
  },
  {
    tag: "Finance",
    title: "Billing and impact simulation",
    text: "Show shifted energy, estimated savings, and environmental indicators.",
  },
  {
    tag: "Security",
    title: "Anomaly monitoring",
    text: "Highlight suspicious charger behavior and operator follow-up actions.",
  },
];

const BENEFIT_CARDS = [
  {
    title: "For residents",
    items: [
      "Clear charge status and completion estimates",
      "More predictable charging outcomes",
      "Simple request flow from one portal",
    ],
  },
  {
    title: "For building teams",
    items: [
      "Safer peak-hour coordination",
      "Faster decisions with priority context",
      "Dashboard visibility across charging and alerts",
    ],
  },
  {
    title: "For property owners",
    items: [
      "Lower operational risk",
      "Better data for EV infrastructure planning",
      "Practical sustainability reporting",
    ],
  },
];

const HOW_IT_WORKS = [
  "Resident submits a charging request.",
  "VerdeWatt forecasts building load and spare capacity.",
  "Scheduler allocates charging power by priority and deadline.",
  "Staff monitors KPIs, security alerts, and recommended actions.",
];

const IMPACT_METRICS = [
  { label: "Shifted energy", value: "278 kWh" },
  { label: "CO2 avoided", value: "115 kg" },
  { label: "Estimated savings", value: "1,540,000 VND" },
];

const SECURITY_CARDS = [
  {
    title: "Abnormal power request detection",
    text: "Flag outlier current or power requests for rapid manual review.",
  },
  {
    title: "Repeated or fake session checks",
    text: "Catch suspicious duplicate session behavior before it affects scheduling.",
  },
  {
    title: "Offline or DoS-like charger behavior",
    text: "Surface persistent charger downtime patterns with suggested follow-up actions.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

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
      <header className="public-header">
        <button
          type="button"
          className="public-brand"
          onClick={() => handleScrollTo("top")}
        >
          <span className="public-brand-mark">VW</span>
          <span className="public-brand-text">VerdeWatt</span>
        </button>

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
            onClick={() => navigate("/portal")}
          >
            Check or Schedule My EV
          </button>
          <button
            type="button"
            className="public-button public-button-primary"
            onClick={() => navigate("/login")}
          >
            Staff Login
          </button>
        </div>
      </header>

      <section className="landing-hero" id="top">
        <div className="landing-hero-copy">
          <p className="public-chip">Smart EV operations for high-rise buildings</p>
          <h1>Safe, practical EV charging management for urban properties.</h1>
          <p>
            VerdeWatt helps building teams forecast demand, allocate charging
            power safely, and keep residents informed without overloading shared
            electrical capacity.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="public-button public-button-primary"
              onClick={() => navigate("/portal")}
            >
              Check or Schedule My EV
            </button>
            <button
              type="button"
              className="public-button public-button-ghost"
              onClick={() => navigate("/login")}
            >
              Staff Login
            </button>
          </div>
        </div>

        <aside className="hero-ops-card">
          <p className="public-chip">Live building snapshot</p>
          <h3>Evening load and charging status</h3>

          <div className="hero-metric-row">
            <span>Total building load</span>
            <strong>472 kW</strong>
          </div>
          <div className="hero-metric-row">
            <span>Safe capacity</span>
            <strong>490 kW</strong>
          </div>
          <div className="hero-metric-row">
            <span>Active EV sessions</span>
            <strong>18</strong>
          </div>

          <ul className="hero-status-list">
            <li>
              <span className="status-dot status-dot-good" />
              18 kW margin under safe capacity
            </li>
            <li>
              <span className="status-dot status-dot-warn" />
              6 sessions prioritized for early deadlines
            </li>
            <li>
              <span className="status-dot status-dot-good" />
              2 security alerts triaged by operator
            </li>
          </ul>
        </aside>
      </section>

      <section className="public-section" id="problem">
        <div className="public-section-head">
          <p className="public-chip">Problem</p>
          <h2>Why unmanaged charging is risky in high-rise apartments</h2>
        </div>
        <div className="public-card-grid public-card-grid-3">
          {PROBLEM_CARDS.map((card) => (
            <article key={card.title} className="public-card">
              <p className="public-tag">{card.tag}</p>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section" id="solution">
        <div className="public-section-head">
          <p className="public-chip">Solution</p>
          <h2>One operational layer for forecasting, scheduling, and safety</h2>
        </div>
        <div className="public-card-grid public-card-grid-4">
          {SOLUTION_CARDS.map((card) => (
            <article key={card.title} className="public-card">
              <p className="public-tag">{card.tag}</p>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section" id="benefits">
        <div className="public-section-head">
          <p className="public-chip">Benefits</p>
          <h2>Built for residents, operators, and property management teams</h2>
        </div>
        <div className="public-card-grid public-card-grid-3">
          {BENEFIT_CARDS.map((card) => (
            <article key={card.title} className="public-card">
              <h3>{card.title}</h3>
              <ul>
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section" id="how-it-works">
        <div className="public-section-head">
          <p className="public-chip">How it works</p>
          <h2>A simple workflow for daily charging operations</h2>
        </div>
        <div className="public-card-grid public-card-grid-4">
          {HOW_IT_WORKS.map((step, index) => (
            <article key={step} className="public-card public-step-card">
              <p className="step-index">Step {index + 1}</p>
              <h3>{step}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section" id="green-impact">
        <div className="public-section-head">
          <p className="public-chip">Green Impact</p>
          <h2>Track impact with practical metrics</h2>
        </div>
        <div className="public-card-grid public-card-grid-3">
          {IMPACT_METRICS.map((metric) => (
            <article key={metric.label} className="public-card impact-highlight">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section" id="security">
        <div className="public-section-head">
          <p className="public-chip">Security</p>
          <h2>Rule-based monitoring for safer EV infrastructure</h2>
        </div>
        <div className="public-card-grid public-card-grid-3">
          {SECURITY_CARDS.map((card) => (
            <article key={card.title} className="public-card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
