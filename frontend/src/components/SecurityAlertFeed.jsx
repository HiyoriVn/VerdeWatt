function resolveSeverity(severity) {
  const level = String(severity || "low").toLowerCase();

  if (level === "high") {
    return {
      label: "High",
      itemClass: "severity-high",
    };
  }

  if (level === "medium") {
    return {
      label: "Medium",
      itemClass: "severity-medium",
    };
  }

  return {
    label: "Low",
    itemClass: "severity-low",
  };
}

function SecurityAlertFeed({ alerts = [] }) {
  return (
    <section className="card glass-card security-feed-card">
      <h3>Security Alert Feed</h3>

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

            return (
              <article
                key={alert.id}
                className={`security-alert-item ${severity.itemClass}`}
              >
                <div className="security-alert-head">
                  <span className="severity-pill">
                    {severity.label}
                  </span>

                  <h4>{alert.title}</h4>
                </div>

                <p>{alert.message}</p>

                <div className="security-alert-meta">
                  <span>
                    Suggested action:{" "}
                    {alert.suggested_action}
                  </span>

                  <time>{alert.timestamp}</time>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="security-feed-footer-btn"
      >
        View all alerts -&gt;
      </button>
    </section>
  );
}

export default SecurityAlertFeed;
