import re

with open('frontend/src/styles/components.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the <small> units inherit color but stay slightly lighter/opacity
css_append = """
/* Make KPI numbers and units vibrant and colorful */
.kpi-card h2 {
  text-shadow: 0 0 16px currentColor;
  font-weight: 700;
}

.kpi-card h2 small {
  color: currentColor !important;
  opacity: 0.8;
  text-shadow: none;
}
"""

if 'Make KPI numbers and units vibrant and colorful' not in content:
    content += css_append
    with open('frontend/src/styles/components.css', 'w', encoding='utf-8') as f:
        f.write(content)
