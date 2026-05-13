import {
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Siren,
} from "lucide-react";

function resolveSeverity(severity) {
  const level = String(severity || "low").toLowerCase();

  if (level === "high") {
    return {
      label: "High",
      itemClass: "severity-high",
      Icon: AlertTriangle,
    };
  }

  if (level === "medium") {
    return {
      label: "Medium",
      itemClass: "severity-medium",
      Icon: Siren,
    };
  }

  return {
    label: "Low",
    itemClass: "severity-low",
    Icon: ShieldAlert,
  };
}

function formatAlertTime(timestamp) {
  if (!timestamp) {
    return "N/A";
  }

  const parsedDate = new Date(timestamp);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(timestamp);
  }

  return parsedDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SecurityAlertFeed({ alerts = [] }) {
  const counts = alerts.reduce(
    (accumulator, alert) => {
      const level = String(
        alert?.severity || ""
      ).toLowerCase();

      if (level === "high") {
        accumulator.high += 1;
      } else if (level === "medium") {
        accumulator.medium += 1;
      } else {
        accumulator.low += 1;
      }

      return accumulator;
    },
    {
      high: 0,
      medium: 0,
      low: 0,
    }
  );

  return (
    <section className="card glass-card security-feed-card">
      <div className="security-feed-header">
        <div className="security-feed-title-wrap">
          <h3>Security Alert Feed</h3>
          <div className="security-header-badges">
            <span className="security-header-badge high">
              High {counts.high}
            </span>
            <span className="security-header-badge medium">
              Medium {counts.medium}
            </span>
            <span className="security-header-badge low">
              Low {counts.low}
            </span>
          </div>
        </div>

        <div className="security-feed-header-actions">
          <button
            type="button"
            className="security-feed-link-btn"
          >
            View all alerts
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {!alerts.length ? (
        <p className="muted-text">
          No active alerts right now.
        </p>
      ) : (
        <div className="security-alert-list">
          {alerts.map((alert) => {
            const severity = resolveSeverity(
              alert.severity
            );
            const Icon = severity.Icon;
            const alertTitle =
              alert.title ||
              "Security anomaly detected";

            return (
              <article
                key={alert.id}
                className={`security-alert-item ${severity.itemClass}`}
              >
                <div className="security-alert-icon-col">
                  <span className="security-alert-big-icon">
                    <Icon size={22} />
                  </span>
                </div>

                <div className="security-alert-body-col">
                  <div className="security-alert-headline-row">
                    <span
                      className={`security-inline-severity ${severity.label.toLowerCase()}`}
                    >
                      {severity.label}
                    </span>
                    <h4>{alertTitle}</h4>
                    <time className="security-alert-time">
                      {formatAlertTime(
                        alert.timestamp
                      )}
                    </time>
                  </div>

                  <p>{alert.message}</p>

                  <div className="security-alert-meta">
                    <span className="security-alert-action">
                      Suggested action:{" "}
                      {alert.suggested_action}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default SecurityAlertFeed;
