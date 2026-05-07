import React, { useEffect, useMemo, useState } from "react";

import AllocationSummary from "./components/AllocationSummary";
import EVSessionCard from "./components/EVSessionCard";
import KPICards from "./components/KPICards";
import LoadCurveChart from "./components/LoadCurveChart";
import SecurityAlertFeed from "./components/SecurityAlertFeed";
import { getAlerts, getBilling, getLoad, getSessions, runAllocation } from "./services/api";

function App() {
  const [load, setLoad] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allocation, setAllocation] = useState(null);
  const [billing, setBilling] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      const localMessages = [];

      try {
        const data = await getLoad();
        setLoad(data);
      } catch {
        localMessages.push("Could not load building curve data. Showing demo fallback.");
      }

      try {
        const data = await getSessions();
        setSessions(data);
      } catch {
        localMessages.push("Could not load EV sessions. Showing empty list for now.");
      }

      try {
        const data = await runAllocation();
        setAllocation(data);
      } catch {
        localMessages.push("Could not run allocation yet. Please ensure backend is running.");
      }

      try {
        const data = await getBilling();
        setBilling(data);
      } catch {
        localMessages.push("Could not load billing KPIs. Cards will stay in fallback mode.");
      }

      try {
        const data = await getAlerts();
        setAlerts(data);
      } catch {
        localMessages.push("Could not load security alerts. Feed is in fallback mode.");
      }

      setMessages(localMessages);
    }

    fetchDashboardData();
  }, []);

  const containerStyle = useMemo(
    () => ({
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f8fbff 0%, #eef5fb 100%)",
      color: "#111827",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px 16px 40px",
    }),
    []
  );

  const sectionStyle = {
    background: "#fdfefe",
    border: "1px solid #d9e3f0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 34 }}>VerdeWatt</h1>
          <p style={{ marginTop: 8, color: "#374151" }}>
            AI-powered cybersecure smart EV charging for high-rise buildings
          </p>
        </header>

        {messages.length > 0 && (
          <section style={{ ...sectionStyle, borderColor: "#f4c77d", background: "#fffaf0" }}>
            <h3 style={{ marginTop: 0 }}>Friendly Fallback Messages</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {messages.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </section>
        )}

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Load Curve Chart</h2>
          <LoadCurveChart data={load} />
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>EV Session Cards</h2>
          {sessions.length === 0 ? (
            <p>No EV sessions available yet.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {sessions.map((session) => (
                <EVSessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Allocation Summary</h2>
          <AllocationSummary allocation={allocation} />
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>KPI Cards</h2>
          <KPICards billing={billing} />
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Security Alert Feed</h2>
          <SecurityAlertFeed alerts={alerts} />
        </section>
      </div>
    </div>
  );
}

export default App;
