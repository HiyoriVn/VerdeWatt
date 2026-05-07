import React from "react";

function SecurityAlertFeed({ alerts = [] }) {
  if (!alerts.length) {
    return <p>No active alerts right now.</p>;
  }

  const severityStyle = (severity) => {
    const level = String(severity || "").toLowerCase();
    if (level === "high") {
      return { label: "High", bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" };
    }
    if (level === "medium") {
      return { label: "Medium", bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
    }
    return { label: "Low", bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {alerts.map((alert) => {
        const badge = severityStyle(alert.severity);

        return (
          <div
            key={alert.id}
            style={{
              border: "1px solid #e5e7eb",
              borderLeft: `6px solid ${badge.color}`,
              borderRadius: 8,
              padding: "10px 12px",
              background: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: badge.bg,
                  color: badge.color,
                  border: `1px solid ${badge.border}`,
                }}
              >
                {badge.label}
              </span>
              <p style={{ margin: 0, fontWeight: 700 }}>{alert.title}</p>
            </div>
            <p style={{ margin: "6px 0" }}>{alert.message}</p>
            <p style={{ margin: "4px 0", fontSize: 13 }}>
              Suggested action: {alert.suggested_action}
            </p>
            <p style={{ margin: "4px 0", fontSize: 12, color: "#4b5563" }}>{alert.timestamp}</p>
          </div>
        );
      })}
    </div>
  );
}

export default SecurityAlertFeed;
