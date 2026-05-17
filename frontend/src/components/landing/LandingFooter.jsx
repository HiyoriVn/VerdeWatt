const FOOTER_LINKS = [
  { id: "problem", label: "Challenge" },
  { id: "results", label: "Results" },
  { id: "how-it-works", label: "How it works" },
  { id: "impact", label: "Impact" },
  { id: "security", label: "Security" },
  { id: "cta", label: "Contact" },
];

export default function LandingFooter({
  onScrollTo,
  onNavigate,
  apiOnline,
}) {
  return (
    <footer className="lp-footer">
      <div className="lp-footer__inner">
        <div className="lp-footer__brand">
          <span className="public-brand-mark">VW</span>
          <div>
            <strong>VerdeWatt</strong>
            <p>AI-powered EV charging for high-rise buildings.</p>
          </div>
          {apiOnline ? (
            <span className="lp-footer__status lp-footer__status--online">
              Systems operational
            </span>
          ) : (
            <span className="lp-footer__status">Limited connectivity</span>
          )}
        </div>

        <nav className="lp-footer__nav" aria-label="Landing page sections">
          {FOOTER_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onScrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="lp-footer__actions">
          <button
            type="button"
            className="public-button public-button-ghost"
            onClick={() => onNavigate("/portal")}
          >
            Resident portal
          </button>
          <button
            type="button"
            className="public-button public-button-primary"
            onClick={() => onNavigate("/login")}
          >
            Operator sign in
          </button>
        </div>
      </div>

      <p className="lp-footer__copy">
        &copy; {new Date().getFullYear()} VerdeWatt. All rights reserved.
      </p>
    </footer>
  );
}
