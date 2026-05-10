import React from "react";

function SecurityAlertFeed({
  alerts = [],
}) {
  if (!alerts.length) {
    return (
      <div className="dashboard-card">
        <p>
          No active alerts right now.
        </p>
      </div>
    );
  }

  const severityStyle = (
    severity
  ) => {
    const level = String(
      severity || ""
    ).toLowerCase();

    if (level === "high") {
      return {
        label: "High",

        bg: "rgba(239,68,68,0.15)",

        color: "#ef4444",

        border:
          "rgba(239,68,68,0.3)",
      };
    }

    if (level === "medium") {
      return {
        label: "Medium",

        bg: "rgba(245,158,11,0.15)",

        color: "#f59e0b",

        border:
          "rgba(245,158,11,0.3)",
      };
    }

    return {
      label: "Low",

      bg: "rgba(34,197,94,0.15)",

      color: "#22c55e",

      border:
        "rgba(34,197,94,0.3)",
    };
  };

  return (
    <div
      style={{
        display: "grid",
        gap: 14,
      }}
    >
      {alerts.map((alert) => {
        const badge =
          severityStyle(
            alert.severity
          );

        return (
          <div
            key={alert.id}
            className="dashboard-card"
            style={{
              borderLeft: `5px solid ${badge.color}`,
            }}
          >
            <div
              style={{
                display: "flex",

                alignItems:
                  "center",

                gap: 10,

                marginBottom: 12,

                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display:
                    "inline-flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  padding:
                    "5px 10px",

                  borderRadius: 999,

                  fontSize: 12,

                  fontWeight: 700,

                  background:
                    badge.bg,

                  color:
                    badge.color,

                  border: `1px solid ${badge.border}`,
                }}
              >
                {badge.label}
              </span>

              <h3
                style={{
                  margin: 0,

                  color:
                    "var(--text)",
                }}
              >
                {alert.title}
              </h3>
            </div>

            <p
              style={{
                marginTop: 0,

                marginBottom: 14,

                color:
                  "var(--text-soft)",

                lineHeight: 1.6,
              }}
            >
              {alert.message}
            </p>

            <div
              style={{
                display: "flex",

                flexDirection:
                  "column",

                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 14,

                  color:
                    "var(--text)",
                }}
              >
                <strong>
                  Suggested action:
                </strong>{" "}
                {
                  alert.suggested_action
                }
              </span>

              <span
                style={{
                  fontSize: 12,

                  color:
                    "var(--text-muted)",
                }}
              >
                {alert.timestamp}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SecurityAlertFeed;