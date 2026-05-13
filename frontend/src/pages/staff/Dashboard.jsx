/* frontend\src\pages\staff\Dashboard.jsx */
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Clock3,
  Moon,
  Sun,
  Zap,
  TrendingDown,
  RefreshCw,
  DollarSign,
  Car,
  Lightbulb
} from "lucide-react";

import {
  getAlerts,
  getBilling,
  getForecast,
  getImpact,
  getLoad,
  getSessions,
  runAllocation,
} from "../../services/api";

import AllocationSummary from "../../components/dashboard/AllocationSummary";
import ChargerCommandPanel from "../../components/dashboard/ChargerCommandPanel";
import ForecastChart from "../../components/dashboard/ForecastChart";
import ImpactCards from "../../components/dashboard/ImpactCards";
import KPICards from "../../components/dashboard/KPICards";
import LoadCurveChart from "../../components/dashboard/LoadCurveChart";
import ScheduleRecommendations from "../../components/dashboard/ScheduleRecommendations";
import SecurityAlertFeed from "../../components/dashboard/SecurityAlertFeed";
import EVSessionCard from "../../components/charging/EVSessionCard";
import VehicleLookup from "../../components/charging/VehicleLookup";
import HeroBanner from "../../components/dashboard/HeroBanner";
import ChargingHeroBanner from "../../components/dashboard/ChargingHeroBanner";


const TAB_DETAILS = {
  dashboard: {
    title: "Energy Control Center",
    subtitle:
      "Real-time EV charging monitoring and safe optimization.",
  },
  "charging-sessions": {
    title: "Charging Sessions",
    subtitle:
      "Monitor active EV sessions, charging priorities, and session readiness.",
  },
  analytics: {
    title: "Analytics",
    subtitle:
      "Forecast demand trends and track green impact performance.",
  },
  allocation: {
    title: "Allocation",
    subtitle:
      "Review optimization outcomes and scheduling recommendations.",
  },
  "billing-energy": {
    title: "Billing & Energy",
    subtitle:
      "Simulated billing and energy-shifting outcomes for management reporting.",
  },
  security: {
    title: "Security",
    subtitle:
      "Track anomalies and charger-side safety incidents in one feed.",
  },
  settings: {
    title: "Settings",
    subtitle:
      "Configuration placeholders for building assumptions and tariff policies.",
  },
};

export default function Dashboard({
  activeTab,
  theme,
  onToggleTheme,
}) {
  const [loadData, setLoadData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [billing, setBilling] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [impact, setImpact] = useState(null);

  const [loading, setLoading] = useState(true);
  const [failedSections, setFailedSections] =
    useState([]);

  const [chargingSearchQuery, setChargingSearchQuery] = useState("");
  const [chargingFilter, setChargingFilter] = useState("All");
  const [selectedEvId, setSelectedEvId] = useState("EV_001");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const requests = [
        {
          key: "load",
          label: "load curve",
          execute: getLoad,
        },
        {
          key: "sessions",
          label: "EV sessions",
          execute: getSessions,
        },
        {
          key: "allocation",
          label: "allocation summary",
          execute: runAllocation,
        },
        {
          key: "alerts",
          label: "security alerts",
          execute: getAlerts,
        },
        {
          key: "billing",
          label: "billing KPIs",
          execute: getBilling,
        },
        {
          key: "forecast",
          label: "AI forecast",
          execute: getForecast,
        },
        {
          key: "impact",
          label: "green impact",
          execute: getImpact,
        },
      ];

      const results = await Promise.allSettled(
        requests.map((requestItem) =>
          requestItem.execute()
        )
      );

      const nextFailedSections = [];

      results.forEach((result, index) => {
        const requestItem = requests[index];

        if (result.status === "rejected") {
          nextFailedSections.push(requestItem.label);

          if (requestItem.key === "load") {
            setLoadData([]);
          }

          if (requestItem.key === "sessions") {
            setSessions([]);
          }

          if (requestItem.key === "allocation") {
            setAllocation(null);
          }

          if (requestItem.key === "alerts") {
            setAlerts([]);
          }

          if (requestItem.key === "billing") {
            setBilling(null);
          }

          if (requestItem.key === "forecast") {
            setForecast(null);
          }

          if (requestItem.key === "impact") {
            setImpact(null);
          }

          return;
        }

        if (requestItem.key === "load") {
          setLoadData(
            Array.isArray(result.value)
              ? result.value
              : []
          );
        }

        if (requestItem.key === "sessions") {
          setSessions(
            Array.isArray(result.value)
              ? result.value
              : []
          );
        }

        if (requestItem.key === "allocation") {
          setAllocation(result.value || null);
        }

        if (requestItem.key === "alerts") {
          setAlerts(
            Array.isArray(result.value)
              ? result.value
              : []
          );
        }

        if (requestItem.key === "billing") {
          setBilling(result.value || null);
        }

        if (requestItem.key === "forecast") {
          setForecast(result.value || null);
        }

        if (requestItem.key === "impact") {
          setImpact(result.value || null);
        }
      });

      setFailedSections(nextFailedSections);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const pageTitle =
    TAB_DETAILS[activeTab]?.title ||
    TAB_DETAILS.dashboard.title;

  const pageSubtitle =
    TAB_DETAILS[activeTab]?.subtitle ||
    TAB_DETAILS.dashboard.subtitle;



  const currentTimeLabel = now.toLocaleTimeString(
    "en-GB",
    {
      hour12: false,
    }
  );

  const currentDateLabel = now.toLocaleDateString(
    undefined,
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
  );

  const sessionPreview = sessions.slice(0, 6);

  const safeCapacityValue = useMemo(() => {
    if (!loadData.length) {
      return "N/A";
    }

    const values = loadData
      .map((item) =>
        Number(item.safe_capacity_kw ?? 0)
      )
      .filter((value) => Number.isFinite(value));

    if (!values.length) {
      return "N/A";
    }

    return `${Math.max(...values)} kW`;
  }, [loadData]);

  function renderDashboardTab() {
    return (
      <>
        <div className="dashboard-top-grid">
          <HeroBanner
            allocation={allocation}
            sessions={sessions}
            alerts={alerts}
            loadData={loadData}
          />

          <AllocationSummary
            allocation={allocation}
          />
        </div>

        <KPICards billing={billing} />

        <div className="main-grid">
          <div className="main-grid-left">
            <LoadCurveChart
              data={loadData}
              allocationData={
                allocation?.total_load_after_optimization
              }
            />

            <section className="card glass-card">
              <div className="section-title-wrap">
                <h3>EV Sessions Preview</h3>
                <p>
                  Active charging sessions prioritized
                  for safe peak-hour operations.
                </p>
              </div>

              {sessionPreview.length ? (
                <div className="ev-session-grid">
                  {sessionPreview.map((session) => (
                    <EVSessionCard
                      key={session.id}
                      session={session}
                    />
                  ))}
                </div>
              ) : (
                <p className="muted-text">
                  No EV sessions available.
                </p>
              )}
            </section>
          </div>

          <div className="main-grid-right">
            <SecurityAlertFeed alerts={alerts} />
          </div>
        </div>
      </>
    );
  }

  function renderChargingTab() {
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
        <div className="charging-top-grid">
          <div className="charging-hero-wrapper">
            <ChargingHeroBanner sessions={sessions} loadData={loadData} />
          </div>

          <section className="card glass-card charging-kpi-row" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-title-wrap">
            <h3 style={{ fontSize: '18px', margin: 0 }}>Smart Charging Optimization</h3>
          </div>
          <div className="charging-kpi-grid">
            <article className="card glass-card kpi-card kpi-cyan" style={{ flex: 1 }}>
              <div className="kpi-card-top"><p>Safe Capacity</p><div className="kpi-card-icon"><Zap size={18} /></div></div>
              <h2>{safeCapacity > 0 ? safeCapacity : "N/A"}<small>kW</small></h2>
            </article>
            <article className="card glass-card kpi-card kpi-green" style={{ flex: 1 }}>
              <div className="kpi-card-top"><p>Peak Reduction</p><div className="kpi-card-icon"><TrendingDown size={18} /></div></div>
              <h2>
                {allocation?.peak_reduction_percent != null
                  ? `${Number(allocation.peak_reduction_percent).toFixed(2)}%`
                  : "N/A"}
              </h2>
            </article>
            <article className="card glass-card kpi-card kpi-blue" style={{ flex: 1 }}>
              <div className="kpi-card-top"><p>Energy Shifted</p><div className="kpi-card-icon"><RefreshCw size={18} /></div></div>
              <h2>{billing?.shifted_kwh ?? "N/A"}<small>kWh</small></h2>
            </article>
            <article className="card glass-card kpi-card kpi-amber" style={{ flex: 1 }}>
              <div className="kpi-card-top"><p>Estimated Saving</p><div className="kpi-card-icon"><DollarSign size={18} /></div></div>
              <h2>{billing?.estimated_saving_vnd != null ? formatVnd(billing.estimated_saving_vnd) : "N/A"}</h2>
            </article>
          </div>
        </section>
        </div>

        <div className="main-grid">
          <div className="main-grid-left">
            <section className="card glass-card">
              <div className="charging-list-header">
                <div className="section-title-wrap" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px' }}>Live Charging Sessions</h3>
                  <div className="subtitle-badge blue-badge" style={{ margin: 0 }}>
                    <Car size={14} />
                    {filteredSessions.length} vehicles found
                  </div>
                </div>
              </div>

              <div className="charging-filters" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px', padding: '10px 20px', borderRadius: '99px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', opacity: 0.5 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input
                    type="text"
                    placeholder="Smart search by EV ID..."
                    value={chargingSearchQuery}
                    onChange={(e) => setChargingSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '15px', color: 'var(--text)', fontWeight: '500' }}
                  />
                </div>
                
                <div className="filter-pills" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {["All", "Urgent", "Normal", "Flexible"].map((filter) => (
                    <button
                      key={filter}
                      className={`filter-pill`}
                      onClick={() => setChargingFilter(filter)}
                      style={{ 
                        padding: '6px 16px', 
                        borderRadius: '99px', 
                        border: chargingFilter === filter ? '1px solid var(--text)' : '1px solid var(--border)', 
                        background: chargingFilter === filter ? 'var(--text)' : 'transparent', 
                        color: chargingFilter === filter ? 'var(--card-bg)' : 'var(--text-soft)',
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
              <div className="section-title-wrap" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '22px' }}>Vehicle Intelligence</h3>
                <div className="subtitle-badge green-badge" style={{ margin: 0 }}>
                  <Lightbulb size={14} />
                  Smart charging recommendation
                </div>
              </div>

              <VehicleLookup selectedEvId={selectedEvId} sessions={sessions} />
            </section>
          </div>
        </div>
      </div>
    );
  }

  function renderAnalyticsTab() {
    return (
      <div className="tab-stack">
        <section className="card glass-card">
          <ForecastChart
            loadData={loadData}
            forecast={forecast}
          />
        </section>

        <section className="card glass-card">
          <ImpactCards impact={impact} />
        </section>
      </div>
    );
  }

  function renderAllocationTab() {
    return (
      <div className="tab-stack">
        <AllocationSummary allocation={allocation} />

        <section className="card glass-card">
          <div className="section-title-wrap">
            <h3 style={{ fontSize: '22px' }}>Optimization Insight</h3>
            <p>
              Before optimization, unmanaged EV demand
              can push total building load above safe
              capacity. Smart allocation shifts demand
              by priority and deadline to reduce peaks
              while maintaining safety margins.
            </p>
          </div>
        </section>

        <section className="card glass-card">
          <div className="section-title-wrap">
            <h3 style={{ fontSize: '22px' }}>Schedule Recommendations</h3>
            <p>
              Actionable charging schedule guidance
              for operators and onsite teams.
            </p>
          </div>

          <ScheduleRecommendations />
        </section>
      </div>
    );
  }

  function renderBillingTab() {
    return (
      <div className="tab-stack">
        <section className="card glass-card">
          <div className="section-title-wrap">
            <h3 style={{ fontSize: '22px' }}>Billing KPI Cards</h3>
            <p>
              Simulated billing outcomes for shifted
              charging behavior and tariff impact.
            </p>
          </div>

          <KPICards billing={billing} />
        </section>

        <section className="card glass-card">
          <h3 style={{ fontSize: '22px' }}>Billing Notes</h3>
          <p className="muted-text">
            Estimated costs and savings are simulation
            outputs intended for planning discussions,
            not real payment processing.
          </p>
        </section>
      </div>
    );
  }

  function renderSecurityTab() {
    return (
      <div className="main-grid">
        <div className="main-grid-left">
          <SecurityAlertFeed alerts={alerts} />
        </div>

        <div className="main-grid-right">
          <section className="card glass-card">
            <div className="section-title-wrap">
              <h3 style={{ fontSize: '22px' }}>Charger Command Monitor</h3>
              <p>
                Operational command stream with safety
                context for charger actions.
              </p>
            </div>

            <ChargerCommandPanel />
          </section>
        </div>
      </div>
    );
  }

  function renderSettingsTab() {
    return (
      <div className="tab-stack">
        <section className="card glass-card settings-grid">
          <div>
            <h4>Building Name</h4>
            <p>VerdeWatt Demo Tower</p>
          </div>

          <div>
            <h4>Safe Capacity</h4>
            <p>{safeCapacityValue}</p>
          </div>

          <div>
            <h4>Tariff Assumption</h4>
            <p>
              Peak/off-peak simulation from billing
              API sample outputs.
            </p>
          </div>

          <div>
            <h4>Theme</h4>
            <p>{theme === "dark" ? "Dark" : "Light"}</p>
          </div>
        </section>

        <section className="card glass-card">
          <h3>Future Configuration (TODO)</h3>
          <p className="muted-text">
            Add editable assumptions for capacity,
            tariffs, and policy profiles in a future
            release.
          </p>
        </section>
      </div>
    );
  }

  function renderTabContent() {
    if (loading) {
      return (
        <section className="card glass-card">
          <p className="muted-text">
            Loading dashboard data...
          </p>
        </section>
      );
    }

    if (activeTab === "dashboard") {
      return renderDashboardTab();
    }

    if (activeTab === "charging-sessions") {
      return renderChargingTab();
    }

    if (activeTab === "analytics") {
      return renderAnalyticsTab();
    }

    if (activeTab === "allocation") {
      return renderAllocationTab();
    }

    if (activeTab === "billing-energy") {
      return renderBillingTab();
    }

    if (activeTab === "security") {
      return renderSecurityTab();
    }

    return renderSettingsTab();
  }

  return (
    <div className="dashboard-page dashboard-reference">
      <header className="dashboard-header">
        <div>
          <h1>{pageTitle}</h1>
          <p>{pageSubtitle}</p>
        </div>

        <div className="dashboard-header-right">
          <div className="live-meta live-meta-inline">
            <Clock3 size={14} />
            <strong>{currentTimeLabel}</strong>
            <span className="live-meta-separator">
              /
            </span>
            <CalendarDays size={14} />
            <span>{currentDateLabel}</span>
          </div>

          <button
            type="button"
            className="dashboard-action-btn"
            aria-label="View notifications"
          >
            <Bell size={16} />
          </button>

          <button
            type="button"
            className="theme-toggle-btn theme-toggle-btn-compact"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>
        </div>
      </header>

      {failedSections.length > 0 && (
        <section className="card warning-card">
          <p>
            Some sections could not be loaded:
            {" "}
            {failedSections.join(", ")}
            .
          </p>
        </section>
      )}

      {renderTabContent()}
    </div>
  );
}


