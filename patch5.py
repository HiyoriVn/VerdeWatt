with open('frontend/src/pages/staff/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Layout for Top Grid
old_top_layout = """      <div className="charging-sessions-tab" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ChargingHeroBanner sessions={sessions} loadData={loadData} />

        <section className="charging-kpi-row" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>"""

new_top_layout = """      <div className="charging-sessions-tab" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="charging-top-grid">
          <div className="charging-hero-wrapper">
            <ChargingHeroBanner sessions={sessions} loadData={loadData} />
          </div>

          <section className="card glass-card charging-kpi-row" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>"""

content = content.replace(old_top_layout, new_top_layout)

# Close the new div
old_top_close = """            </article>
          </div>
        </section>

        <div className="main-grid">"""

new_top_close = """            </article>
          </div>
        </section>
        </div>

        <div className="main-grid">"""

content = content.replace(old_top_close, new_top_close)

# 2. Update Search Bar and Filter Pills
old_search = """                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '99px', flex: 1, minWidth: '200px' }}>
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
                </div>"""

new_search = """                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px', padding: '10px 20px', borderRadius: '99px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', opacity: 0.5 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input
                    type="text"
                    placeholder="Smart search by EV ID..."
                    value={chargingSearchQuery}
                    onChange={(e) => setChargingSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '15px', color: 'var(--text)', fontWeight: '500' }}
                  />
                </div>
                
                <div className="segmented-control">
                  {["All", "Urgent", "Normal", "Flexible"].map((filter) => (
                    <button
                      key={filter}
                      className={`filter-pill ${chargingFilter === filter ? 'active' : ''}`}
                      onClick={() => setChargingFilter(filter)}
                      style={{ 
                        padding: '8px 20px', 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>"""

content = content.replace(old_search, new_search)

with open('frontend/src/pages/staff/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
