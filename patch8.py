with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the image
old_bg = """      <div className="hero-bg-layer">
        <img
          src={heroImage}
          alt="EV charging"
          className="hero-image"
        />
      </div>"""

content = content.replace(old_bg, '')

with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

css = """
/* Make the stats the huge focal point */
.charging-hero-banner .hero-content-layer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.charging-hero-banner .hero-content {
  flex: 1;
}

.charging-hero-banner .charging-hero-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  flex: 1.2;
  position: relative !important;
  right: 0 !important;
  transform: none !important;
  min-width: 450px;
  margin: 0 !important;
}

.charging-hero-banner .charging-stat-card {
  padding: 24px 32px;
  border-radius: 16px;
  gap: 24px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 2px 20px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.1);
}

.charging-hero-banner .charging-stat-icon {
  opacity: 0.5;
}

.charging-hero-banner .charging-stat-icon svg {
  width: 28px;
  height: 28px;
}

.charging-hero-banner .charging-stat-content {
  gap: 8px;
}

.charging-hero-banner .charging-stat-content strong {
  font-size: 42px; /* Huge numbers */
  letter-spacing: -1px;
}

.charging-hero-banner .charging-stat-content span {
  font-size: 15px;
  color: #94a3b8;
  letter-spacing: 0.5px;
}
"""

with open('frontend/src/styles/components.css', 'a', encoding='utf-8') as f:
    f.write(css)
