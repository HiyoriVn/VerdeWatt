import React from "react";

function SecurityAlertFeed({ alerts = [] }) {
  if (!alerts.length) {
    return <p>No active alerts right now.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            border: "1px solid #e5e7eb",
            borderLeft: alert.severity === "High" ? "6px solid #dc2626" : "6px solid #d97706",
            borderRadius: 8,
            padding: "10px 12px",
            background: "#ffffff",
          }}
        >
          <p style={{ margin: 0, fontWeight: 700 }}>{alert.title} ({alert.severity})</p>
          <p style={{ margin: "6px 0" }}>{alert.message}</p>
          <p style={{ margin: "4px 0", fontSize: 13 }}>
            Suggested action: {alert.suggested_action}
          </p>
          <p style={{ margin: "4px 0", fontSize: 12, color: "#4b5563" }}>{alert.timestamp}</p>
        </div>
      ))}
    </div>
  );
}

export default SecurityAlertFeed;
