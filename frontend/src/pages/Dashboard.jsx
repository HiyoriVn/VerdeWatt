import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Moon,
  Sun,
} from "lucide-react";

import {
  getAlerts,
  getBilling,
  getForecast,
  getImpact,
  getLoad,
  getSessions,
  runAllocation,
} from "../services/api";

import AllocationSummary from "../components/AllocationSummary";
import ChargerCommandPanel from "../components/ChargerCommandPanel";
import EVSessionCard from "../components/EVSessionCard";
import ForecastChart from "../components/ForecastChart";
import ImpactCards from "../components/ImpactCards";
import KPICards from "../components/KPICards";
import LoadCurveChart from "../components/LoadCurveChart";
import ScheduleRecommendations from "../components/ScheduleRecommendations";
import SecurityAlertFeed from "../components/SecurityAlertFeed";
import VehicleLookup from "../components/VehicleLookup";

const TAB_DETAILS = {
  dashboard: {
    title: "VerdeWatt",
    subtitle:
      "AI-powered cybersecure smart EV charging for high-rise buildings",
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
        <KPICards billing={billing} />

        <div className="main-grid">
          <div className="main-grid-left">
            <LoadCurveChart
              data={loadData}
              allocationData={
                allocation?.total_load_after_optimization
              }
            />

            <AllocationSummary allocation={allocation} />

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
          <h3>Optimization Insight</h3>
          <p className="muted-text">
            Before optimization, unmanaged EV demand
            can push total building load above safe
            capacity. Smart allocation shifts demand
            by priority and deadline to reduce peaks
            while maintaining safety margins.
          </p>
        </section>

        <section className="card glass-card">
          <div className="section-title-wrap">
            <h3>Schedule Recommendations</h3>
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
            <h3>Billing KPI Cards</h3>
            <p>
              Simulated billing outcomes for shifted
              charging behavior and tariff impact.
            </p>
          </div>

          <KPICards billing={billing} />
        </section>

        <section className="card glass-card">
          <h3>Billing Notes</h3>
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
              <h3>Charger Command Monitor</h3>
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
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>{pageTitle}</h1>
          <p>{pageSubtitle}</p>
        </div>

        <div className="dashboard-header-right">
          <div className="live-meta">
            <div>
              <Clock3 size={14} />
              <strong>
                {now.toLocaleTimeString("en-GB", {
                  hour12: false,
                })}
              </strong>
            </div>

            <div>
              <CalendarDays size={14} />
              <span>
                {now.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
            <span>
              {theme === "dark"
                ? "Light"
                : "Dark"}
            </span>
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
