import sys

def patch_file():
    with open('frontend/src/pages/staff/Dashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add imports
    content = content.replace('import HeroBanner from "../../components/dashboard/HeroBanner";', 'import HeroBanner from "../../components/dashboard/HeroBanner";\nimport ChargingHeroBanner from "../../components/dashboard/ChargingHeroBanner";')

    # 2. Add state
    old_state = """  const [loading, setLoading] = useState(true);
  const [failedSections, setFailedSections] =
    useState([]);

  const [now, setNow] = useState(new Date());"""
    new_state = """  const [loading, setLoading] = useState(true);
  const [failedSections, setFailedSections] =
    useState([]);

  const [chargingSearchQuery, setChargingSearchQuery] = useState("");
  const [chargingFilter, setChargingFilter] = useState("All");
  const [selectedEvId, setSelectedEvId] = useState("EV_001");

  const [now, setNow] = useState(new Date());"""
    if old_state in content:
        content = content.replace(old_state, new_state)

    # 3. Replace renderChargingTab
    old_render = """  function renderChargingTab() {
    return (
      <div className="tab-stack">
        <section className="card glass-card">
          <div className="section-title-wrap">
            <h3>EV Charging Sessions</h3>
            <p>
              Session status, SOC targets, and
              priority-based charging context.
            </p>
          </div>

          {sessions.length ? (
            <div className="ev-session-grid">
              {sessions.map((session) => (
                <EVSessionCard
                  key={session.id}
                  session={session}
                />
              ))}
            </div>
          ) : (
            <p className="muted-text">
              No EV sessions found.
            </p>
          )}
        </section>

        <section className="card glass-card">
          <div className="section-title-wrap">
            <h3>Vehicle Lookup</h3>
            <p>
              Search a vehicle code for the latest
              recommendation and charging strategy.
            </p>
          </div>

          <VehicleLookup />
        </section>
      </div>
    );
  }"""

    new_render = """  function renderChargingTab() {
    const filteredSessions = sessions.filter((s) => {
      const matchesSearch = s.id
        .toLowerCase()
        .includes(chargingSearchQuery.toLowerCase());
      const matchesFilter =
        chargingFilter === "All" ||
        String(s.priority).toLowerCase() === chargingFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    const safeCapacityValues = loadData
      .map((item) => Number(item.safe_capacity_kw))
      .filter((value) => Number.isFinite(value));
      
    const safeCapacity = safeCapacityValues.length > 0 ? Math.max(...safeCapacityValues) : 0;

    const formatVnd = (value) =>
      new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 0,
      }).format(Number(value ?? 0)) + "đ";

    return (
      <div className="charging-sessions-tab" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ChargingHeroBanner sessions={sessions} loadData={loadData} />

        <section className="charging-kpi-row" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-title-wrap">
            <h3 style={{ fontSize: '18px', margin: 0 }}>Smart Charging Optimization</h3>
          </div>
          <div className="kpi-row">
            <article className="card glass-card kpi-card kpi-cyan" style={{ flex: 1 }}>
              <div className="kpi-card-top"><p>Safe Capacity</p></div>
              <h2>{safeCapacity > 0 ? safeCapacity : "N/A"}<small>kW</small></h2>
            </article>
            <article className="card glass-card kpi-card kpi-green" style={{ flex: 1 }}>
              <div className="kpi-card-top"><p>Peak Reduction</p></div>
              <h2>
                {allocation?.peak_reduction_percent != null
                  ? `${Number(allocation.peak_reduction_percent).toFixed(2)}%`
                  : "N/A"}
              </h2>
            </article>
            <article className="card glass-card kpi-card kpi-blue" style={{ flex: 1 }}>
              <div className="kpi-card-top"><p>Energy Shifted</p></div>
              <h2>{billing?.shifted_kwh ?? "N/A"}<small>kWh</small></h2>
            </article>
            <article className="card glass-card kpi-card kpi-amber" style={{ flex: 1 }}>
              <div className="kpi-card-top"><p>Estimated Saving</p></div>
              <h2>{billing?.estimated_saving_vnd != null ? formatVnd(billing.estimated_saving_vnd) : "N/A"}</h2>
            </article>
          </div>
        </section>

        <div className="main-grid">
          <div className="main-grid-left">
            <section className="card glass-card">
              <div className="charging-list-header" style={{ marginBottom: '20px' }}>
                <div className="section-title-wrap">
                  <h3>Live Charging Sessions</h3>
                  <p>{filteredSessions.length} vehicles found</p>
                </div>
              </div>

              <div className="charging-filters" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '99px', flex: 1, minWidth: '200px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', opacity: 0.5 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input
                    type="text"
                    placeholder="Search EV ID..."
                    value={chargingSearchQuery}
                    onChange={(e) => setChargingSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: 'var(--text)' }}
                  />
                  <button className="search-btn" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Search</button>
                </div>
                
                <div className="filter-pills" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {["All", "Urgent", "Normal", "Flexible"].map((filter) => (
                    <button
                      key={filter}
                      className="filter-pill"
                      onClick={() => setChargingFilter(filter)}
                      style={{ 
                        padding: '6px 16px', 
                        borderRadius: '99px', 
                        border: '1px solid var(--border)', 
                        background: chargingFilter === filter ? 'var(--text)' : 'transparent', 
                        color: chargingFilter === filter ? 'var(--card-bg)' : 'var(--text)',
                        fontSize: '13px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {filteredSessions.length ? (
                <div className="ev-session-grid compact" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                  {filteredSessions.map((session) => (
                    <div 
                      key={session.id} 
                      onClick={() => setSelectedEvId(session.id)}
                      style={{ cursor: "pointer", opacity: selectedEvId && selectedEvId !== session.id ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
                    >
                      <EVSessionCard session={session} isSelected={selectedEvId === session.id} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted-text">No EV sessions found.</p>
              )}
            </section>
          </div>

          <div className="main-grid-right">
            <section className="card glass-card vehicle-intelligence-panel" style={{ position: 'sticky', top: '24px' }}>
              <div className="section-title-wrap" style={{ marginBottom: '20px' }}>
                <h3>Vehicle Intelligence</h3>
                <p>Smart charging recommendation</p>
              </div>

              <VehicleLookup selectedEvId={selectedEvId} sessions={sessions} />
            </section>
          </div>
        </div>
      </div>
    );
  }"""
    
    if old_render in content:
        content = content.replace(old_render, new_render)
    
    with open('frontend/src/pages/staff/Dashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    patch_file()
