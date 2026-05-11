import { useEffect, useState } from "react";

import { api } from "../api/api";

import KPICards from "../components/KPICards";
import EVSessionCard from "../components/EVSessionCard";
import AllocationSummary from "../components/AllocationSummary";
import SecurityAlertFeed from "../components/SecurityAlertFeed";
import LoadCurveChart from "../components/LoadCurveChart";

export default function Dashboard() {
  const [load, setLoad] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [billing, setBilling] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const [
        loadData,
        sessionsData,
        allocationData,
        billingData,
        alertsData,
      ] = await Promise.all([
        api.getLoad(),
        api.getSessions(),
        api.runAllocation(),
        api.getBilling(),
        api.getAlerts(),
      ]);

      setLoad(loadData);
      setSessions(sessionsData);
      setAllocation(allocationData);
      setBilling(billingData);
      setAlerts(alertsData);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>VerdeWatt Dashboard</h1>

        <p>
          AI-powered smart EV infrastructure
        </p>
      </div>

      <KPICards billing={billing} />

      <LoadCurveChart data={load} />

      <div className="card-grid">
        {sessions.map((session) => (
          <EVSessionCard
            key={session.id}
            session={session}
          />
        ))}
      </div>

      <AllocationSummary allocation={allocation} />

      <SecurityAlertFeed alerts={alerts} />
    </div>
  );
}