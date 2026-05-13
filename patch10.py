with open('frontend/src/pages/staff/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<div className="kpi-row">\n            <article className="card glass-card kpi-card kpi-cyan"', '<div className="charging-kpi-grid">\n            <article className="card glass-card kpi-card kpi-cyan"')

with open('frontend/src/pages/staff/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
