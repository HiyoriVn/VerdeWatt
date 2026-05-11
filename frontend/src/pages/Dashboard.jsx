import { useEffect, useState } from "react";

import {
  getLoad,
  getSessions,
  runAllocation,
  getAlerts,
  getBilling,
  getChargerCommands,
} from "../services/api";

import KPICards from "../components/KPICards";
import EVSessionCard from "../components/EVSessionCard";
import AllocationSummary from "../components/AllocationSummary";
import SecurityAlertFeed from "../components/SecurityAlertFeed";
import LoadCurveChart from "../components/LoadCurveChart";
import ChargerCommandPanel from "../components/ChargerCommandPanel";
import ScheduleRecommendations from "../components/ScheduleRecommendations";
import VehicleLookup from "../components/VehicleLookup";

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
        const [
          load,
          sessionData,
          allocationData,
          alertData,
          billingData,
        ] = await Promise.all([
          getLoad(),
          getSessions(),
          runAllocation(),
          getAlerts(),
          getBilling(),
        ]);

        setLoadData(load);
        setSessions(sessionData);
        setAllocation(allocationData);
        setAlerts(alertData);
        setBilling(billingData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
  <div className="dashboard-page">

    {/* HEADER */}

    <div className="dashboard-header">
      <h1>Smart EV Energy Dashboard</h1>

      <p>
        Real-time charging orchestration,
        smart load balancing,
        and energy optimization platform.
      </p>
    </div>

    {/* =========================
       TOP KPI OVERVIEW
    ========================= */}

    <div className="card-grid">
      <div className="dashboard-card">
        <h3>Billing & Energy KPI</h3>

        <KPICards billing={billing} />
      </div>

      <div className="dashboard-card">
        <h3>Allocation Summary</h3>

        <AllocationSummary allocation={allocation} />
      </div>
    </div>

    {/* =========================
       REALTIME MONITORING
    ========================= */}

    <div className="dashboard-card dashboard-card-large">
      <div className="section-header">
        <div>
          <h3>Grid Load Monitoring</h3>
          <p>
            Real-time power demand
            and overload risk analysis.
          </p>
        </div>
      </div>

      <LoadCurveChart data={loadData} />
    </div>

    <div className="card-grid">
      <div className="dashboard-card">
        <div className="section-header">
          <div>
            <h3>Security Alerts</h3>
            <p>
              Active incidents and
              charging anomalies.
            </p>
          </div>
        </div>

        <SecurityAlertFeed alerts={alerts} />
      </div>

      <div className="dashboard-card">
        <div className="section-header">
          <div>
            <h3>Charger Commands</h3>
            <p>
              Live charger control actions
              from orchestration engine.
            </p>
          </div>
        </div>

        <ChargerCommandPanel />
      </div>
    </div>

    {/* =========================
       SMART SCHEDULING
    ========================= */}

    <div className="dashboard-card dashboard-card-large">
      <div className="section-header">
        <div>
          <h3>Smart Charging Schedule</h3>

          <p>
            AI-driven charging recommendations
            optimized for grid safety.
          </p>
        </div>
      </div>

      <ScheduleRecommendations />
    </div>

    {/* =========================
       VEHICLE MANAGEMENT
    ========================= */}

    <div className="card-grid">
      <div className="dashboard-card">
        <div className="section-header">
          <div>
            <h3>Vehicle Lookup</h3>

            <p>
              Search recommendation
              and charging strategy
              for a specific EV.
            </p>
          </div>
        </div>

        <VehicleLookup />
      </div>

      <div className="dashboard-card">
        <div className="section-header">
          <div>
            <h3>EV Charging Sessions</h3>

            <p>
              Connected vehicles
              and charging priorities.
            </p>
          </div>
        </div>

        <div className="card-grid">
          {sessions.map((session) => (
            <EVSessionCard
              key={session.id}
              session={session}
            />
          ))}
        </div>
      </div>
    </div>

  </div>
);
}