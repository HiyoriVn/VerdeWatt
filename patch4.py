with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('from "lucide-react";', '  BatteryCharging\n} from "lucide-react";\n\nimport heroImage from "../../assets/dashboard/ev-hero.png";')

content = content.replace('<section className="hero-banner charging-hero-banner">\n\n', '<section className="hero-banner charging-hero-banner">\n      <div className="hero-bg-layer">\n        <img\n          src={heroImage}\n          alt="EV charging"\n          className="hero-image"\n        />\n      </div>\n\n')

content = content.replace('<Car size={22}', '<BatteryCharging size={22}')

with open('frontend/src/components/dashboard/ChargingHeroBanner.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

css = """
.charging-top-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.charging-top-grid .charging-kpi-row {
  margin-top: 0 !important;
  height: 100%;
}

.charging-top-grid .charging-kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: calc(100% - 40px); /* Fill the remaining height */
}

.charging-top-grid .kpi-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 1200px) {
  .charging-top-grid {
    grid-template-columns: 1fr;
  }
  .charging-top-grid .charging-kpi-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 768px) {
  .charging-top-grid .charging-kpi-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Smart Search */
.charging-filters .search-bar {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(8px);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
}
.charging-filters .search-bar:focus-within {
  background: #ffffff !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5), inset 0 2px 4px rgba(0,0,0,0.02);
}

.segmented-control {
  display: flex;
  background: var(--bg);
  padding: 4px;
  border-radius: 99px;
  border: 1px solid var(--border);
}
.segmented-control .filter-pill {
  border: none !important;
  background: transparent !important;
  color: var(--text-muted) !important;
}
.segmented-control .filter-pill.active {
  background: #ffffff !important;
  color: #0f172a !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.dark .segmented-control .filter-pill.active {
  background: #334155 !important;
  color: #f8fafc !important;
}
"""

with open('frontend/src/styles/components.css', 'a', encoding='utf-8') as f:
    f.write(css)
