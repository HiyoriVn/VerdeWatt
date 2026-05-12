import {
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

function resolveSeverity(severity) {
  const level = String(
    severity || "low"
  ).toLowerCase();

  if (level === "high") {
    return {
      label: "High",
      icon: (
        <AlertTriangle
          size={18}
        />
      ),
      className:
        "alert-high",
    };
  }

  if (level === "medium") {
    return {
      label: "Medium",
      icon: (
        <ShieldAlert
          size={18}
        />
      ),
      className:
        "alert-medium",
    };
  }

  return {
    label: "Low",
    icon: (
      <ShieldAlert
        size={18}
      />
    ),
    className:
      "alert-low",
  };
}

export default function SecurityAlertFeed({
  alerts = [],
}) {
  return (
    <section className="card glass-card security-feed-card">

      <div className="section-header">

        <h3>
          Security Alert Feed
        </h3>

        <button className="ghost-button">
          View all alerts
        </button>

      </div>

      {!alerts.length ? (
        <p className="muted-text">
          No active alerts right now.
        </p>
      ) : (
        <div className="security-alert-list">

          {alerts.map(
            (alert) => {
              const severity =
                resolveSeverity(
                  alert.severity
                );

              return (
                <article
                  key={alert.id}
                  className={`security-alert-item ${severity.className}`}
                >

                  <div className="security-alert-top">

                    <div className="security-alert-icon">
                      {severity.icon}
                    </div>

                    <div className="security-alert-content">

                      <span className="security-severity">
                        {
                          severity.label
                        }
                      </span>

                      <h4>
                        {
                          alert.title
                        }
                      </h4>

                    </div>

                    <div className="security-alert-time">
                      <span>
                        {
                          alert.timestamp
                        }
                      </span>

                      <small>
                        Today
                      </small>
                    </div>

                  </div>

                  <p className="security-alert-message">
                    {
                      alert.message
                    }
                  </p>

                  <div className="security-alert-action">

                    <strong>
                      Suggested action:
                    </strong>

                    <span>
                      {
                        alert.suggested_action
                      }
                    </span>

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}