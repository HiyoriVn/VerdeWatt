with open('frontend/src/pages/staff/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Smart Charging Optimization
old_smart = """<div className="section-title-wrap">
              <h3 style={{ fontSize: '18px', margin: 0 }}>Smart Charging Optimization</h3>
            </div>"""
new_smart = """<div className="section-title-wrap">
              <h3>Smart Charging Optimization</h3>
              <p>Real-time capacity allocation and peak reduction</p>
            </div>"""
content = content.replace(old_smart, new_smart)

# Fix Live Charging Sessions
old_live = """<div className="charging-list-header" style={{ marginBottom: '20px' }}>
            <div className="section-title-wrap">
              <h3>Live Charging Sessions</h3>
              <p>{filteredSessions.length} vehicles found</p>
            </div>
          </div>"""
new_live = """<div className="charging-list-header">
            <div className="section-title-wrap">
              <h3>Live Charging Sessions</h3>
              <p>{filteredSessions.length} vehicles found</p>
            </div>
          </div>"""
content = content.replace(old_live, new_live)

# Fix Vehicle Intelligence
old_vehicle = """<div className="section-title-wrap" style={{ marginBottom: '20px' }}>
              <h3>Vehicle Intelligence</h3>
              <p>Smart charging recommendation</p>
            </div>"""
new_vehicle = """<div className="section-title-wrap">
              <h3>Vehicle Intelligence</h3>
              <p>Smart charging recommendation</p>
            </div>"""
content = content.replace(old_vehicle, new_vehicle)

with open('frontend/src/pages/staff/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
