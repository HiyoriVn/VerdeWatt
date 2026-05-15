import { useEffect, useState } from "react";

const STORAGE_KEY = "verdewatt-lp-cta-open";

export default function LandingStickyCta({ onScrollTo, onNavigate }) {
  const [showWidget, setShowWidget] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(window.sessionStorage.getItem(STORAGE_KEY) === "1");

    function onScroll() {
      setShowWidget(window.scrollY > 480);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function persistOpen(nextOpen) {
    setOpen(nextOpen);
    window.sessionStorage.setItem(STORAGE_KEY, nextOpen ? "1" : "0");
  }

  function handleToggle() {
    persistOpen(!open);
  }

  function handleClose() {
    persistOpen(false);
  }

  if (!showWidget) {
    return null;
  }

  return (
    <div
      className={`lp-sticky-cta${open ? " lp-sticky-cta--open" : ""}`}
      role="complementary"
      aria-label="Quick actions"
    >
      {open ? (
        <div className="lp-sticky-cta__panel">
          <button
            type="button"
            className="lp-sticky-cta__close"
            onClick={handleClose}
            aria-label="Close quick actions"
          >
            ×
          </button>
          <p className="lp-sticky-cta__title">Get started with VerdeWatt</p>
          <div className="lp-sticky-cta__actions">
            <button
              type="button"
              className="lp-sticky-cta__btn lp-sticky-cta__btn--ghost"
              onClick={() => onScrollTo("cta")}
            >
              Contact us
            </button>
            <button
              type="button"
              className="lp-sticky-cta__btn lp-sticky-cta__btn--primary"
              onClick={() => onNavigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="lp-sticky-cta__fab"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={open ? "Hide quick actions" : "Show quick actions"}
      >
        {open ? "−" : "⚡"}
      </button>
    </div>
  );
}
