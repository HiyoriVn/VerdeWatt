import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingAllocationCompare from "../../components/landing/LandingAllocationCompare";
import LandingDashboardPreview from "../../components/landing/LandingDashboardPreview";
import LandingFooter from "../../components/landing/LandingFooter";
import LandingStickyCta from "../../components/landing/LandingStickyCta";
import { useLandingLiveStats } from "../../hooks/useLandingLiveStats";
import { applyLandingMeta, resetAppMeta } from "../../utils/landingMeta";
import heroImage from "../../assets/landingpage/screen7.png";
import challengeImage from "../../assets/landingpage/screen1.png";
import workflowImage from "../../assets/landingpage/screen4.png";
import impactImage from "../../assets/landingpage/screen6.png";
import securityImage from "../../assets/landingpage/screen3.png";

const NAV_LINKS = [
  { id: "problem", label: "Challenge" },
  { id: "results", label: "Results" },
  { id: "how-it-works", label: "How it works" },
  { id: "impact", label: "Impact" },
  { id: "security", label: "Security" },
  { id: "cta", label: "Contact" },
];

const SCROLL_SPY_IDS = NAV_LINKS.map((link) => link.id);

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

function SectionHead({ chip, title, subtitle, centered = false }) {
  return (
    <div
      className={`public-section-head${centered ? " public-section-head--center" : ""
        }`}
    >
      <p className="public-chip">{chip}</p>
      <h2>{title}</h2>
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
        {/* Hero watercolor background — confined to hero only */}
        <div className="hero-bg-wrap" aria-hidden="true">
          <img
            src={heroImage}
            alt=""
            className="hero-bg-img"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="hero-bg-fade" />
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
            subtitle="Evening peak (18:00–22:00) is when unmanaged charging most often exceeds safe capacity."
            centered
          />
          <div className="lp-challenge-showcase">
            <figure className="lp-challenge-showcase__visual">
              <div className="lp-challenge-showcase__img-wrap">
                <img
                  src={challengeImage}
                  alt="Underground EV parking with smart charging hubs"
                  loading="lazy"
                  decoding="async"
                  width={960}
                  height={720}
                />
                {/* Overlay badge */}
                <div className="lp-challenge-overlay-badge">
                  <span className="lp-challenge-overlay-badge__dot" />
                  Peak Risk Zone
                </div>
                {/* Overlay stats strip */}
                <div className="lp-challenge-overlay-strip">
                  <div className="lp-challenge-overlay-strip__item">
                    <strong>18:00–22:00</strong>
                    <span>Peak window</span>
                  </div>
                  <div className="lp-challenge-overlay-strip__divider" />
                  <div className="lp-challenge-overlay-strip__item">
                    <strong>{statsLoading ? "…" : heroStats.sessionCount}+ EVs</strong>
                    <span>Charging at once</span>
                  </div>
                  <div className="lp-challenge-overlay-strip__divider" />
                  <div className="lp-challenge-overlay-strip__item lp-challenge-overlay-strip__item--danger">
                    <strong>Overload risk</strong>
                    <span>Without smart control</span>
                  </div>
                </div>
              </div>
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

              {/* Modern 2-line area chart */}
              {(() => {
                const W = 260, H = 120;
                const PAD = { t: 30, r: 12, b: 28, l: 28 };
                const safeKw = statsLoading ? 120 : heroStats.safeCapacityKw;
                const peak = statsLoading ? 154 : peakBeforeKw;

                // Load curve points (rises to peak at 20h, falls after)
                const loadPts = [
                  { h: 17, kw: Math.round(safeKw * 0.62) },
                  { h: 18, kw: Math.round(safeKw * 0.78) },
                  { h: 19, kw: Math.round(peak * 0.86) },
                  { h: 20, kw: peak },
                  { h: 21, kw: Math.round(peak * 0.91) },
                  { h: 22, kw: Math.round(safeKw * 0.79) },
                  { h: 23, kw: Math.round(safeKw * 0.58) },
                ];
                const maxKw = peak * 1.12;
                const chartW = W - PAD.l - PAD.r;
                const chartH = H - PAD.t - PAD.b;

                const toX = (i) => PAD.l + (i / (loadPts.length - 1)) * chartW;
                const toY = (kw) => PAD.t + chartH - (kw / maxKw) * chartH;

                // Smooth cubic bezier for a set of points
                const buildPath = (pts) => {
                  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
                  for (let i = 1; i < pts.length; i++) {
                    const cpx = ((pts[i - 1].x + pts[i].x) / 2).toFixed(1);
                    d += ` C ${cpx} ${pts[i - 1].y.toFixed(1)}, ${cpx} ${pts[i].y.toFixed(1)}, ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
                  }
                  return d;
                };

                const loadCoords = loadPts.map((p, i) => ({ x: toX(i), y: toY(p.kw) }));
                const safeY = toY(safeKw);
                const safeCoords = loadPts.map((_, i) => ({ x: toX(i), y: safeY }));

                const loadPath = buildPath(loadCoords);
                const safePath = buildPath(safeCoords);

                // Area fill between safe line and load line
                const areaD = `${loadPath} L ${loadCoords[loadCoords.length - 1].x} ${safeY} L ${loadCoords[0].x} ${safeY} Z`;

                // Peak marker at hour 20 (index 3)
                const pkIdx = 3;
                const pkX = loadCoords[pkIdx].x;
                const pkY = loadCoords[pkIdx].y;

                // Y-axis ticks
                const yTicks = [0, 0.33, 0.66, 1].map((t) => ({
                  y: PAD.t + chartH * (1 - t),
                  val: Math.round(maxKw * t),
                }));

                // X-axis labels (show every other)
                const xLabels = loadPts.filter((_, i) => i % 2 === 0);

                return (
                  <div className="lp-sparkline">
                    <svg
                      viewBox={`0 0 ${W} ${H}`}
                      width="100%"
                      preserveAspectRatio="xMidYMid meet"
                      aria-label="Evening load vs safe capacity"
                      style={{ display: "block", overflow: "visible" }}
                    >
                      <defs>
                        {/* Gradient fill between safe line and load curve */}
                        <linearGradient id="lp-area-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e07a5f" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#7ab832" stopOpacity="0.04" />
                        </linearGradient>
                      </defs>

                      {/* Y-axis tick marks */}
                      {yTicks.map((t) => (
                        <g key={t.val}>
                          <line x1={PAD.l - 4} y1={t.y} x2={PAD.l} y2={t.y} stroke="#c8d4be" strokeWidth="1" />
                          <text x={PAD.l - 7} y={t.y + 3.5} textAnchor="end" fill="#a0b090" fontSize="7.5" fontFamily="inherit">{t.val}</text>
                        </g>
                      ))}

                      {/* X-axis baseline */}
                      <line x1={PAD.l} y1={PAD.t + chartH} x2={PAD.l + chartW} y2={PAD.t + chartH} stroke="#dde8d0" strokeWidth="1" />

                      {/* Area fill */}
                      <path d={areaD} fill="url(#lp-area-fill)" />

                      {/* Safe capacity line */}
                      <path d={safePath} fill="none" stroke="#7ab832" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" strokeDasharray="5 3" />

                      {/* Load curve */}
                      <path d={loadPath} fill="none" stroke="#e07a5f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Vertical dashed line at peak */}
                      <line x1={pkX} y1={pkY + 8} x2={pkX} y2={PAD.t + chartH} stroke="#e07a5f" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                      {/* Peak dot */}
                      <circle cx={pkX} cy={pkY} r="5" fill="#fff" stroke="#e07a5f" strokeWidth="2.2" />
                      <circle cx={pkX} cy={pkY} r="2" fill="#e07a5f" />

                      {/* Dark pill tooltip */}
                      <g transform={`translate(${pkX},${pkY - 12})`}>
                        <rect x="-32" y="-24" width="64" height="22" rx="8" fill="#1e2a18" />
                        <polygon points="-5,0 5,0 0,7" fill="#1e2a18" />
                        <text x="0" y="-9" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="800" fontFamily="inherit" letterSpacing="-0.3">
                          {statsLoading ? "…" : `${peak} kW`}
                        </text>
                      </g>

                      {/* X-axis hour labels */}
                      {xLabels.map((p, idx) => {
                        const i = loadPts.indexOf(p);
                        return (
                          <text key={p.h} x={toX(i)} y={H - 8} textAnchor="middle" fill="#9aaa8a" fontSize="8" fontWeight="700" fontFamily="inherit">
                            {p.h}h
                          </text>
                        );
                      })}

                      {/* Safe line label */}
                      <text x={PAD.l + chartW + 2} y={safeY + 4} fill="#7ab832" fontSize="7.5" fontWeight="700" fontFamily="inherit">cap</text>
                    </svg>

                    {/* Legend row */}
                    <div className="lp-sparkline__legend">
                      <span className="lp-sparkline__leg lp-sparkline__leg--load">
                        <span className="lp-sparkline__leg-line" />
                        Unmanaged load
                      </span>
                      <span className="lp-sparkline__leg lp-sparkline__leg--safe">
                        <span className="lp-sparkline__leg-line lp-sparkline__leg-line--dashed" />
                        Safe capacity
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Extra stats row */}
              <div className="lp-challenge-meter__extra">
                <div className="lp-challenge-meter__extra-item">
                  <span className="lp-challenge-meter__extra-val lp-challenge-meter__extra-val--red">
                    {statsLoading ? "…" : `+${Math.max(0, peakBeforeKw - heroStats.safeCapacityKw)} kW`}
                  </span>
                  <span className="lp-challenge-meter__extra-label">Over safe limit</span>
                </div>
                <div className="lp-challenge-meter__extra-item">
                  <span className="lp-challenge-meter__extra-val">3 hrs</span>
                  <span className="lp-challenge-meter__extra-label">At-risk window</span>
                </div>
                <div className="lp-challenge-meter__extra-item">
                  <span className="lp-challenge-meter__extra-val lp-challenge-meter__extra-val--green">
                    {statsLoading ? "…" : `−${peakReductionPercent}%`}
                  </span>
                  <span className="lp-challenge-meter__extra-label">With VerdeWatt</span>
                </div>
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
              onClick={() =>
                navigate("/login?redirect=%2Fdashboard%2Fallocation")
              }
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
        className="public-section lp-section lp-reveal"
        id="impact"
      >
        <div className="lp-section__inner">
          <div className="lp-metric-band lp-metric-band--glass">
            <img
              src={impactImage}
              alt=""
              className="lp-metric-band__bg"
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <div className="lp-metric-band__glass-overlay" />
            <div className="lp-metric-band__inner">
              <div className="lp-metric-band__head">
                <p className="public-chip public-chip--light">Impact</p>
                <h2>Practical KPIs for operators and ESG reporting</h2>
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
        </div>
      </section>

      <section className="public-section lp-section lp-reveal" id="security">
        <div className="lp-section__inner">
          <SectionHead
            chip="Security"
            title="Rule-based monitoring for safer EV infrastructure"
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
              {SECURITY_CARDS.map((card) => {
                const borderColor =
                  card.severity === "High" ? "#e07a5f" :
                    card.severity === "Medium" ? "#f0b429" : "#7ab832";
                return (
                  <article
                    key={card.title}
                    className="lp-card lp-alert-card"
                    style={{ borderLeft: `3px solid ${borderColor}` }}
                  >
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
                );
              })}
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

      <section className="lp-cta lp-reveal" id="cta">
        <div className="lp-cta__inner">
          <p className="public-chip">Get started</p>
          <h2>Ready to bring smarter EV charging to your building?</h2>
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
