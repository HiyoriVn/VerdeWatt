// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import {
  Activity,
  ShieldCheck,
  Car,
  Zap,
  ArrowRight,
} from "lucide-react";

import {
  getAlerts,
  getBilling,
  getLoad,
  getSessions,
  runAllocation,
} from "../services/api";

import KPICards from "../components/dashboard/KPICards";
import LoadCurveChart from "../components/dashboard/LoadCurveChart";
import AllocationSummary from "../components/dashboard/AllocationSummary";
import EVSessionCard from "../components/charging/EVSessionCard";
import SecurityAlertFeed from "../components/security/SecurityAlertFeed";

export default function Dashboard() {
  const [loadData, setLoadData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const results =
          await Promise.allSettled([
            getLoad(),
            getSessions(),
            runAllocation(),
            getAlerts(),
            getBilling(),
          ]);

        if (results[0].status === "fulfilled") {
          setLoadData(
            Array.isArray(results[0].value)
              ? results[0].value
              : []
          );
        }

        if (results[1].status === "fulfilled") {
          setSessions(
            Array.isArray(results[1].value)
              ? results[1].value
              : []
          );
        }

        if (results[2].status === "fulfilled") {
          setAllocation(results[2].value);
        }

        if (results[3].status === "fulfilled") {
          setAlerts(
            Array.isArray(results[3].value)
              ? results[3].value
              : []
          );
        }

        if (results[4].status === "fulfilled") {
          setBilling(results[4].value);
        }
      } catch (error) {
        console.error(
          "Dashboard load failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="card glass-card">
        <p className="muted-text">
          Loading dashboard...
        </p>
      </section>
    );
  }

  return (
    <div className="dashboard-page">

      {/* HERO */}
      <section className="hero-layout">

        <section className="hero-banner glass-card">

          <div className="hero-banner-content">

            <div className="hero-badge">
              <Zap size={15} />
              <span>Smart Grid Active</span>
            </div>

            <h2>
              Real-time EV energy
              orchestration
            </h2>

            <p>
              VerdeWatt balances EV demand,
              reduces overload risks and
              optimizes building energy usage
              automatically.
            </p>

          </div>

          <div className="hero-stats-grid">

            <div className="hero-stat-card">
              <Activity size={18} />
              <div>
                <strong>
                  {sessions.length}
                </strong>
                <span>Active EVs</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <ShieldCheck size={18} />
              <div>
                <strong>
                  {alerts.length}
                </strong>
                <span>
                  Security Alerts
                </span>
              </div>
            </div>

            <div className="hero-stat-card">
              <Car size={18} />
              <div>
                <strong>
                  {allocation?.safe_capacity_kw ??
                    "N/A"}{" "}
                  kW
                </strong>
                <span>
                  Safe Capacity
                </span>
              </div>
            </div>

          </div>
        </section>

        <aside className="summary-side">
          <AllocationSummary
            allocation={allocation}
          />
        </aside>

      </section>

      {/* KPI */}
      <KPICards billing={billing} />

      {/* MAIN GRID */}
      <section className="dashboard-main">

        <div className="dashboard-left">

          <div className="load-curve-area">
            <LoadCurveChart
              data={loadData}
              allocationData={
                allocation?.total_load_after_optimization
              }
            />
          </div>

          <section className="card glass-card live-session-card">

            <div className="section-header">

              <div>
                <h3>
                  Live Charging Sessions
                </h3>

                <p>
                  Recent EV charging
                  activity
                </p>
              </div>

              <button className="ghost-button">
                View All
                <ArrowRight size={16} />
              </button>

            </div>

            {sessions.length ? (
              <div className="ev-session-grid">

                {sessions
                  .slice(0, 6)
                  .map((session) => (
                    <EVSessionCard
                      key={session.id}
                      session={session}
                    />
                  ))}

              </div>
            ) : (
              <p className="muted-text">
                No active charging
                sessions.
              </p>
            )}

          </section>
        </div>

        <aside className="security-area">
          <SecurityAlertFeed
            alerts={alerts.slice(0, 4)}
          />
        </aside>

      </section>
    </div>
  );
}

