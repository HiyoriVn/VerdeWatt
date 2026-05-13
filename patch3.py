with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import heroImage from "../../assets/dashboard/ev-hero.png";\n', '')

old_bg = """      {/* BACKGROUND IMAGE */}
      <div className="hero-bg-layer">
        <img
          src={heroImage}
          alt="EV charging"
          className="hero-image"
        />
      </div>"""

content = content.replace(old_bg, '')

content = content.replace('<section className="hero-banner">', '<section className="hero-banner charging-hero-banner">')

with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

new_css = """
/* Charging Hero Banner Overrides */
.charging-hero-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.5);
  position: relative;
  overflow: hidden;
}

/* Add a subtle glow effect to the background */
.charging-hero-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 75% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.charging-hero-banner .hero-status {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
}

.charging-hero-banner h2 {
  color: #f8fafc;
}

.charging-hero-banner p {
  color: #cbd5e1;
}

.charging-hero-banner .hero-mini-stats {
  position: relative;
  z-index: 2;
}

/* Make stats boxes glassmorphic to pop against the dark background */
.charging-hero-banner .mini-stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.charging-hero-banner .mini-stat-card strong {
  color: #f8fafc;
}

.charging-hero-banner .mini-stat-card span {
  color: #94a3b8;
}
"""

with open('frontend/src/styles/components.css', 'a', encoding='utf-8') as f:
    f.write(new_css)
