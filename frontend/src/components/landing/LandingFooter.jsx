export default function LandingFooter({
  onScrollTo,
  onNavigate,
  apiOnline,
}) {
  return (
    <footer className="lp-footer">
      <div className="lp-footer__inner">
        <div className="lp-footer__brand">
          <BrandIdentity showText={false} />
          <div>
            <strong>VerdeWatt</strong>
            <p>AI-powered EV charging for high-rise buildings.</p>
          </div>
        </div>
      </div>

      <p className="lp-footer__copy">
        &copy; 2026 VerdeWatt by Tecnologia Verde. All rights reserved.
      </p>
    </footer>
  );
}
import BrandIdentity from "./BrandIdentity";
