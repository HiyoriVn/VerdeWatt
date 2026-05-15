import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingAllocationCompare from "../../components/landing/LandingAllocationCompare";
import LandingDashboardPreview from "../../components/landing/LandingDashboardPreview";
import LandingFooter from "../../components/landing/LandingFooter";
import LandingStickyCta from "../../components/landing/LandingStickyCta";
import { useLandingLiveStats } from "../../hooks/useLandingLiveStats";
import { applyLandingMeta, resetAppMeta } from "../../utils/landingMeta";
import heroImage from "../../assets/landingpage/unname2.png";
import challengeImage from "../../assets/landingpage/screen1.png";
import workflowImage from "../../assets/landingpage/screen4.png";
import impactImage from "../../assets/landingpage/screen6.png";
import plansScaleImage from "../../assets/landingpage/screen5.png";
import securityImage from "../../assets/landingpage/screen3.png";

const NAV_LINKS = [
  { id: "problem", label: "Challenge" },
  { id: "results", label: "Results" },
  { id: "how-it-works", label: "How it works" },
  { id: "impact", label: "Impact" },
  { id: "plans", label: "Plans" },
  { id: "security", label: "Security" },
  { id: "cta", label: "Contact" },
];

const SCROLL_SPY_IDS = NAV_LINKS.map((link) => link.id);

const PRODUCT_OFFERINGS = [
  {
    name: "Resident portal",
    role: "For residents",
    description:
      "Residents check charging status, submit requests, and see expected completion times.",
    features: [
      "Vehicle status lookup",
      "Charging request in a few taps",
      "Clear completion guidance",
    ],
    path: "/portal",
    cta: "Go to resident portal",
  },
  {
    name: "Building operations",
    role: "Most popular",
    description:
      "Property teams monitor load, optimize charging, and respond to alerts in one place.",
    features: [
      "Load forecast and smart allocation",
      "Security alert feed",
      "Billing and sustainability KPIs",
    ],
    path: "/login",
    cta: "Sign in as operator",
    featured: true,
  },
  {
    name: "Portfolio & enterprise",
    role: "Multi-site",
    description:
      "Property groups planning EV infrastructure across several high-rise buildings.",
    features: [
      "Portfolio capacity planning",
      "Custom tariff assumptions",
      "ESG and impact reporting",
    ],
    contact: true,
    cta: "Talk to our team",
  },
];

const PROBLEM_CARDS = [
  {
    tag: "Peak hours",
    title: "Peak overload risk",
    text: "Between 18:00–22:00, unmanaged EV demand can push total load above your safe capacity limit.",
  },
  {
    tag: "Infrastructure",
    title: "Transformer stress",
    text: "Repeated evening spikes strain shared transformers and raise maintenance and outage risk.",
  },
  {
    tag: "Residents",
    title: "Unfair charging queues",
    text: "Without clear priorities, urgent sessions compete with flexible ones and residents lose trust.",
  },
];

const WORKFLOW_STEPS = [
  {
    keyword: "Forecast",
    text: "See building load and safe capacity so you know what headroom is left.",
  },
  {
    keyword: "Schedule",
    text: "Review active EV sessions with priority, deadlines, and charge targets.",
  },
  {
    keyword: "Optimize",
    text: "Allocate power automatically so total load stays within safe limits.",
  },
  {
    keyword: "Operate",
    text: "Track KPIs, energy costs, environmental impact, and security alerts.",
  },
];

const SECURITY_CARDS = [
  {
    title: "Abnormal power request detection",
    text: "Flag outlier current or power requests for rapid manual review.",
    severity: "High",
    action: "Throttle session and notify operator",
  },
  {
    title: "Repeated or fake session checks",
    text: "Catch suspicious duplicate session behavior before it affects scheduling.",
    severity: "Medium",
    action: "Pause allocation for review",
  },
  {
    title: "Offline or DoS-like charger behavior",
    text: "Surface persistent charger downtime with suggested follow-up actions.",
    severity: "High",
    action: "Mark charger offline and reroute power",
  },
];

function SectionHead({ chip, title, titleVi, subtitle, centered = false }) {
  return (
    <div
      className={`public-section-head${
        centered ? " public-section-head--center" : ""
      }`}
    >
      <p className="public-chip">{chip}</p>
      <h2>{title}</h2>
      {titleVi ? <p className="lp-section-head__vi">{titleVi}</p> : null}
      {subtitle ? <p className="lp-section-head__sub">{subtitle}</p> : null}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  const {
    loading: statsLoading,
    apiOnline,
    impactMetrics,
    chartData,
    heroStats,
    peakReductionPercent,
    peakBeforeKw,
    peakAfterKw,
    peakReductionKw,
    peakAfterIsSafe,
    evsServedLabel,
    alertCount,
  } = useLandingLiveStats();

  const trustMetrics = [
    {
      abbr: "PEAK",
      label: "Peak reduction",
      value: statsLoading ? "…" : `−${peakReductionPercent}%`,
    },
    {
      abbr: "EV",
      label: "Active sessions",
      value: statsLoading ? "…" : String(heroStats.sessionCount),
    },
    {
      abbr: "RULE",
      label: "Security rules",
      value: "3",
    },
    {
      abbr: "ALERT",
      label: "Active alerts",
      value: statsLoading ? "…" : String(alertCount),
    },
  ];

  useEffect(() => {
    applyLandingMeta(heroImage);

    const revealElements = document.querySelectorAll(".lp-reveal");
    const revealObserver =
      revealElements.length > 0
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  revealObserver.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
          )
        : null;

    revealElements.forEach((element) => revealObserver?.observe(element));

    const spySections = SCROLL_SPY_IDS.map((id) =>
      document.getElementById(id)
    ).filter(Boolean);

    const spyObserver =
      spySections.length > 0
        ? new IntersectionObserver(
            (entries) => {
              const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                  (a, b) => b.intersectionRatio - a.intersectionRatio
                );

              if (visible[0]?.target?.id) {
                setActiveSection(visible[0].target.id);
              }
            },
            { threshold: [0.2, 0.45, 0.6], rootMargin: "-20% 0px -55% 0px" }
          )
        : null;

    spySections.forEach((section) => spyObserver?.observe(section));

    function onScrollTop() {
      if (window.scrollY < 120) {
        setActiveSection("top");
      }
    }

    window.addEventListener("scroll", onScrollTop, { passive: true });
    onScrollTop();

    return () => {
      revealObserver?.disconnect();
      spyObserver?.disconnect();
      window.removeEventListener("scroll", onScrollTop);
      resetAppMeta();
    };
  }, []);

  function handleScrollTo(sectionId) {
    setNavOpen(false);
    const element = document.getElementById(sectionId);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function goToOperatorSignIn() {
    navigate("/login");
  }

  return (
    <div className="public-page landing-page" id="main-content">
      <a className="lp-skip-link" href="#top">
        Skip to content
      </a>

      <LandingStickyCta onScrollTo={handleScrollTo} onNavigate={navigate} />

      <header className="public-header">
        <button
          type="button"
          className="public-brand"
          onClick={() => handleScrollTo("top")}
        >
          <span className="public-brand-mark">VW</span>
          <span className="public-brand-text">VerdeWatt</span>
        </button>

        <button
          type="button"
          className="lp-nav-toggle"
          aria-expanded={navOpen}
          aria-controls="landing-nav"
          onClick={() => setNavOpen((open) => !open)}
        >
          {navOpen ? "Close" : "Menu"}
        </button>

        <nav
          id="landing-nav"
          className={`public-nav${navOpen ? " public-nav--open" : ""}`}
          aria-label="Landing sections"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className={activeSection === link.id ? "is-active" : undefined}
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
            Resident portal
          </button>
          <button
            type="button"
            className="public-button public-button-primary"
            onClick={goToOperatorSignIn}
          >
            Sign in
          </button>
        </div>
      </header>

      {navOpen ? (
        <button
          type="button"
          className="lp-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <section className="landing-hero" id="top">
        <div className="hero-illustration-wrap">
          <img
            src={heroImage}
            alt="EV charging station in a smart building garage"
            className="hero-illustration"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={1920}
            height={1080}
          />
        </div>

        <div className="hero-inner">
          <div className="hero-left">
            <p className="hero-badge">SMART · SAFE · SUSTAINABLE</p>
            <h1 className="hero-headline">
              AI&#8209;powered<br />
              <span className="hero-headline-accent">EV&nbsp;charging</span><br />
              orchestration<br />
              for smart buildings
            </h1>
            <p className="lp-section-head__vi hero-headline-vi">
              Nền tảng điều phối sạc EV an toàn cho chung cư và tòa nhà thông minh
            </p>
            <p className="hero-subtext">
              Help your building stay within safe electrical capacity, give residents
              a smoother charging experience, and give operators clear visibility
              every evening peak.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="public-button public-button-primary"
                onClick={goToOperatorSignIn}
              >
                Sign in to dashboard
              </button>
              <button
                type="button"
                className="hero-btn-text"
                onClick={() => handleScrollTo("results")}
              >
                See how it works &rarr;
              </button>
            </div>
          </div>

          <div className="hero-right hero-right--stacked">
            <div className="hero-card hero-card--load">
              <p className="hero-card__label">Live building load</p>
              <div className="hero-card__body">
                <div className="hero-card__nums">
                  <span className="hero-card__value">
                    {statsLoading ? "…" : heroStats.currentLoadKw}
                  </span>
                  <span className="hero-card__unit">kW</span>
                </div>
                <div className="hero-card__ring">
                  <svg viewBox="0 0 80 80" aria-hidden="true">
                    <circle cx="40" cy="40" r="32" className="hero-card__ring-bg" />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      className="hero-card__ring-fill"
                      strokeDasharray="201"
                      strokeDashoffset={statsLoading ? 8 : heroStats.ringOffset}
                    />
                  </svg>
                  <span className="hero-card__ring-text">
                    {statsLoading ? "…" : `${heroStats.capacityPercent}%`}
                  </span>
                </div>
              </div>
              <p className="hero-card__sub hero-card__sub--capacity">
                of {statsLoading ? "…" : heroStats.safeCapacityKw} kW safe capacity
              </p>
              <div className="hero-card__bar">
                <div
                  className="hero-card__bar-fill"
                  style={{
                    width: statsLoading
                      ? "96%"
                      : `${heroStats.capacityPercent}%`,
                  }}
                />
              </div>
            </div>

            <div className="hero-card hero-card--sessions">
              <div>
                <p className="hero-card__label">Active sessions</p>
                <div className="hero-card__nums">
                  <span className="hero-card__value">
                    {statsLoading ? "…" : heroStats.sessionCount}
                  </span>
                </div>
                <p className="hero-card__delta">
                  {apiOnline ? "Updated in real time" : "Connect your building to sync"}
                </p>
              </div>
            </div>

            <div className="hero-card hero-card--peak">
              <div>
                <p className="hero-card__label">Peak reduction</p>
                <span className="hero-card__value hero-card__value--green">
                  {statsLoading ? "…" : `${peakReductionPercent}%`}
                </span>
                <p className="hero-card__sub">vs unmanaged charging</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="public-section lp-section lp-section--challenge lp-reveal"
        id="problem"
      >
        <div className="lp-section__inner">
          <SectionHead
            chip="Challenge"
            title="Why unmanaged charging is risky in high-rise apartments"
            titleVi="Vì sao sạc EV không kiểm soát gây quá tải vào giờ cao điểm"
            subtitle="Evening peak (18:00–22:00) is when unmanaged charging most often exceeds safe capacity."
            centered
          />
          <div className="lp-challenge-showcase">
            <figure className="lp-challenge-showcase__visual">
              <img
                src={challengeImage}
                alt="Underground EV parking with smart charging hubs"
                loading="lazy"
                decoding="async"
                width={960}
                height={720}
              />
              <figcaption>Shared basement hubs · one building transformer</figcaption>
            </figure>

            <article className="lp-card lp-challenge-meter">
              <div className="lp-challenge-meter__head">
                <div>
                  <p className="lp-challenge-meter__eyebrow">Evening peak scenario</p>
                  <h3 className="lp-challenge-meter__title">Load vs safe capacity</h3>
                </div>
                <span className="lp-challenge-meter__window">18:00–22:00</span>
              </div>

              <div className="lp-challenge-meter__stats">
                <div className="lp-challenge-meter__stat lp-challenge-meter__stat--peak">
                  <span className="lp-challenge-meter__stat-label">Unmanaged peak</span>
                  <strong>
                    {statsLoading ? "…" : peakBeforeKw}
                    <small>kW</small>
                  </strong>
                </div>
                <div className="lp-challenge-meter__stat-divider" aria-hidden="true" />
                <div className="lp-challenge-meter__stat lp-challenge-meter__stat--safe">
                  <span className="lp-challenge-meter__stat-label">Safe limit</span>
                  <strong>
                    {statsLoading ? "…" : heroStats.safeCapacityKw}
                    <small>kW</small>
                  </strong>
                </div>
              </div>

              <div
                className="lp-challenge-meter__track"
                role="img"
                aria-label={
                  statsLoading
                    ? "Loading peak comparison"
                    : `${peakBeforeKw} kilowatts unmanaged peak versus ${heroStats.safeCapacityKw} kilowatts safe limit`
                }
              >
                <div
                  className="lp-challenge-meter__safe"
                  style={{
                    flexGrow: statsLoading
                      ? 78
                      : Math.max(heroStats.safeCapacityKw, 1),
                  }}
                />
                <div
                  className="lp-challenge-meter__over"
                  style={{
                    flexGrow: statsLoading
                      ? 22
                      : Math.max(0, peakBeforeKw - heroStats.safeCapacityKw),
                  }}
                />
              </div>

              <div className="lp-challenge-meter__foot">
                <p className="lp-challenge-meter__caption">
                  {statsLoading
                    ? "Loading peak scenario…"
                    : `${peakBeforeKw} kW total demand exceeds ${heroStats.safeCapacityKw} kW safe capacity by ${Math.max(0, peakBeforeKw - heroStats.safeCapacityKw)} kW`}
                </p>
                {!statsLoading && peakBeforeKw > heroStats.safeCapacityKw ? (
                  <span className="lp-challenge-meter__badge">Over safe limit</span>
                ) : null}
              </div>
            </article>
          </div>

          <div className="lp-challenge-risks">
            {PROBLEM_CARDS.map((card, index) => (
              <article key={card.title} className="lp-card lp-challenge-risk">
                <span className="lp-challenge-risk__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="public-tag">{card.tag}</p>
                <h3>{card.title}</h3>
                <p className="lp-card__text">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="public-section lp-section lp-section--compare lp-reveal"
        id="results"
      >
        <div className="lp-section__inner">
        <SectionHead
          chip="Results"
          title="Before vs after smart allocation"
          titleVi="So sánh đỉnh tải trước và sau khi VerdeWatt điều phối"
          subtitle={
            apiOnline
              ? "Live optimization results for your building’s evening peak window."
              : "Connect your building to see personalized load and allocation results."
          }
          centered
        />
        <LandingAllocationCompare
          peakBeforeKw={peakBeforeKw}
          peakAfterKw={peakAfterKw}
          peakReductionKw={peakReductionKw}
          peakReductionPercent={peakReductionPercent}
          peakAfterIsSafe={peakAfterIsSafe}
          loading={statsLoading}
        />
        <div className="lp-compare-cta">
          <button
            type="button"
            className="public-button public-button-primary"
            onClick={() => navigate("/dashboard/allocation")}
          >
            Open allocation view
          </button>
          <button
            type="button"
            className="hero-btn-text"
            onClick={goToOperatorSignIn}
          >
            Sign in to explore &rarr;
          </button>
        </div>
        </div>
      </section>

      <section className="public-section lp-section lp-reveal" id="how-it-works">
        <div className="lp-section__inner lp-section__inner--wide">
        <div className="lp-how-layout">
          <div className="lp-how-layout__copy">
            <SectionHead
              chip="How it works"
              title="A clear workflow for your operations team"
              titleVi="Quy trình vận hành rõ ràng cho ban quản lý"
              subtitle="Forecast → Schedule → Optimize → Operate — the same flow your team uses every day."
              centered
            />
            <ol className="lp-steps lp-steps--stacked">
              {WORKFLOW_STEPS.map((step, index) => (
                <li key={step.keyword} className="lp-card lp-step">
                  <span className="lp-step__num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="lp-step__body">
                    <p className="lp-step__keyword">{step.keyword}</p>
                    <p className="lp-step__text">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="lp-steps-note">
              Already a customer?{" "}
              <button
                type="button"
                className="hero-btn-text"
                onClick={goToOperatorSignIn}
              >
                Sign in with your operator account &rarr;
              </button>
            </p>
          </div>
          <div className="lp-how-layout__aside">
            <figure className="lp-how-workflow">
              <img
                src={workflowImage}
                alt="EV charging hub connected to building power infrastructure"
                loading="lazy"
                decoding="async"
                width={1200}
                height={675}
              />
              <figcaption>
                Coordinate grid headroom with on-site charging in real time.
              </figcaption>
            </figure>
            <LandingDashboardPreview
              peakReductionPercent={peakReductionPercent}
              evsServedLabel={evsServedLabel}
              alertCount={alertCount}
              loading={statsLoading}
              chartData={chartData}
              apiOnline={apiOnline}
              onOpenDashboard={() => navigate("/dashboard")}
            />
          </div>
        </div>
        <div className="lp-quote-band">
          <p className="lp-quote-band__text">
            One platform for forecasting, smart scheduling, cost visibility, and
            security monitoring — built for high-rise properties.
          </p>
        </div>
        </div>
      </section>

      <section
        className="public-section lp-section lp-section--flush lp-reveal"
        id="impact"
      >
        <div className="lp-metric-band">
          <img
            src={impactImage}
            alt=""
            className="lp-metric-band__bg lp-metric-band__bg--impact"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div className="lp-metric-band__overlay" />
          <div className="lp-metric-band__inner">
            <div className="lp-metric-band__head">
              <p className="public-chip public-chip--light">Impact</p>
              <h2>Practical KPIs for operators and ESG reporting</h2>
              <p className="lp-section-head__vi lp-metric-band__vi">
                Theo dõi tiết kiệm năng lượng và tác động môi trường
              </p>
              <p className="lp-metric-band__sub">
                {apiOnline
                  ? "Updated from your building’s latest charging and optimization data."
                  : "Estimated outcomes when charging is coordinated vs unmanaged."}
              </p>
            </div>
            <div className="lp-card-grid lp-card-grid--3 lp-metric-grid">
              {impactMetrics.map((metric) => (
                <article key={metric.label} className="lp-card lp-metric-card">
                  <p>{metric.label}</p>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section lp-section lp-reveal" id="plans">
        <div className="lp-section__inner">
        <SectionHead
          chip="Plans"
          title="Choose the experience that fits your role"
          titleVi="Chọn trải nghiệm phù hợp với bạn"
          subtitle="Residents, building operators, and portfolio teams each get tools tailored to their needs."
          centered
        />
        <figure className="lp-plans-band">
          <img
            src={plansScaleImage}
            alt="Residential, enterprise, and smart-city EV charging scale"
            className="lp-plans-band__img"
            loading="lazy"
            decoding="async"
            width={1600}
            height={500}
          />
          <figcaption className="lp-plans-band__caption">
            From a single tower to multi-site portfolios — one orchestration platform.
          </figcaption>
        </figure>
        <div className="lp-card-grid lp-card-grid--3 lp-plans-grid">
          {PRODUCT_OFFERINGS.map((role) => (
            <article
              key={role.name}
              className={`lp-card lp-pricing-card lp-plan-card${
                role.featured ? " lp-pricing-card--featured" : ""
              }`}
            >
              <div className="lp-pricing-card__top">
              {role.featured ? (
                <p className="lp-pricing-card__badge">{role.role}</p>
              ) : (
                <p className="lp-pricing-card__badge lp-pricing-card__badge--muted">
                  {role.role}
                </p>
              )}
              </div>
              <h3>{role.name}</h3>
              <p className="lp-pricing-card__desc">{role.description}</p>
              <ul>
                {role.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className={
                  role.featured
                    ? "public-button public-button-primary"
                    : "public-button public-button-ghost"
                }
                onClick={() => {
                  if (role.contact) {
                    handleScrollTo("cta");
                    return;
                  }
                  navigate(role.path);
                }}
              >
                {role.cta}
              </button>
            </article>
          ))}
        </div>
        </div>
      </section>

      <section className="public-section lp-section lp-reveal" id="security">
        <div className="lp-section__inner">
        <SectionHead
          chip="Security"
          title="Rule-based monitoring for safer EV infrastructure"
          titleVi="Giám sát theo quy tắc — không dùng ML hộp đen"
          subtitle="Three explainable anomaly rules with severity and suggested operator actions."
          centered
        />
        <div className="lp-security-layout">
          <div className="lp-security-layout__media">
            <img
              src={securityImage}
              alt="Sustainable urban EV charging infrastructure sketch"
              className="lp-split__img lp-split__img--focus-security"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="lp-card-grid lp-card-grid--3">
          {SECURITY_CARDS.map((card) => (
            <article key={card.title} className="lp-card lp-alert-card">
              <div className="lp-alert-card__head">
                <span
                  className={`lp-severity lp-severity--${card.severity.toLowerCase()}`}
                >
                  {card.severity}
                </span>
                <h3>{card.title}</h3>
              </div>
              <p className="lp-card__text">{card.text}</p>
              <p className="lp-alert-card__action">
                <strong>Suggested:</strong> {card.action}
              </p>
            </article>
          ))}
          </div>
        </div>
        <div className="lp-section-actions lp-section-actions--center">
          <button
            type="button"
            className="hero-btn-text"
            onClick={() => navigate("/dashboard/security")}
          >
            View security feed in dashboard &rarr;
          </button>
        </div>
        </div>
      </section>

      <div className="lp-trust lp-reveal">
        <div className="lp-section__inner">
        <p className="lp-trust__label">Why buildings choose VerdeWatt</p>
        <div className="lp-card-grid lp-card-grid--4 lp-trust-logos">
          {trustMetrics.map((metric) => (
            <div key={metric.label} className="lp-card lp-trust-partner">
              <span className="lp-trust-partner__mark">{metric.abbr}</span>
              <span className="lp-trust-logo">{metric.label}</span>
              <strong className="lp-trust-metric">{metric.value}</strong>
            </div>
          ))}
        </div>
        </div>
      </div>

      <section className="lp-cta lp-reveal" id="cta">
        <div className="lp-cta__inner">
          <p className="public-chip">Get started</p>
          <h2>Ready to bring smarter EV charging to your building?</h2>
          <p className="lp-section-head__vi">
            Sẵn sàng triển khai sạc EV thông minh cho tòa nhà của bạn?
          </p>
          <p>
            Talk to our team about a pilot, or sign in if your property already
            uses VerdeWatt.
          </p>
          <p className="lp-cta__contact">
            Sales & support:{" "}
            <a href="mailto:hello@verdewatt.com">hello@verdewatt.com</a>
            {" · "}
            <a href="tel:+842812345678">+84 28 1234 5678</a>
          </p>
          <div className="lp-cta__actions">
            <button
              type="button"
              className="public-button public-button-primary"
              onClick={() => handleScrollTo("plans")}
            >
              Request a consultation
            </button>
            <button
              type="button"
              className="public-button public-button-ghost"
              onClick={goToOperatorSignIn}
            >
              Operator sign in
            </button>
            <button
              type="button"
              className="public-button public-button-ghost"
              onClick={() => navigate("/portal")}
            >
              Resident portal
            </button>
          </div>
        </div>
      </section>

      <LandingFooter
        onScrollTo={handleScrollTo}
        onNavigate={navigate}
        apiOnline={apiOnline}
      />
    </div>
  );
}
