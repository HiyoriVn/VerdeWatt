import { useState } from "react";

const LOGO_CANDIDATES = [
  "/src/assets/brand/verdewatt-logo.svg",
  "/src/assets/brand/logo.png",
  "/assets/brand/verdewatt-logo.svg",
  "/assets/brand/logo.png",
];

export default function BrandIdentity({
  className = "",
  showText = true,
  text = "VerdeWatt",
  mark = "VW",
  markClassName = "public-brand-mark",
  textClassName = "public-brand-text",
  imageClassName = "public-brand-logo",
}) {
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoAvailable, setLogoAvailable] = useState(true);

  function handleLogoError() {
    if (logoIndex < LOGO_CANDIDATES.length - 1) {
      setLogoIndex((currentIndex) => currentIndex + 1);
      return;
    }

    setLogoAvailable(false);
  }

  return (
    <span className={`lp-brand ${className}`.trim()}>
      {logoAvailable ? (
        <img
          src={LOGO_CANDIDATES[logoIndex]}
          alt=""
          className={imageClassName}
          onError={handleLogoError}
          decoding="async"
        />
      ) : (
        <span className={markClassName}>{mark}</span>
      )}

      {showText ? <span className={textClassName}>{text}</span> : null}
    </span>
  );
}
