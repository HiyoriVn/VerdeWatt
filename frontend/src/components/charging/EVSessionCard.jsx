function EVSessionCard({ session }) {
  const priorityKey = String(
    session?.priority || "normal"
  ).toLowerCase();

  const priorityClassMap = {
    urgent: "priority-urgent",
    normal: "priority-normal",
    flexible: "priority-flexible",
  };

  const priorityClass =
    priorityClassMap[priorityKey] ||
    "priority-normal";

  const currentSoc = Number(
    session?.current_soc ?? 0
  );
  const targetSoc = Number(
    session?.target_soc ?? 100
  );
  const socProgress = Math.max(
    0,
    Math.min(
      targetSoc > 0
        ? (currentSoc / targetSoc) * 100
        : 0,
      100
    )
  );

  return (
    <article
      className={`card glass-card ev-card ev-card-${priorityKey}`}
    >
      <div className="ev-card-top">
        <h3>{session.id}</h3>

        <span
          className={`ev-priority-badge ${priorityClass}`}
        >
          {priorityKey}
        </span>
      </div>

      <div className="ev-soc-track">
        <div
          className="ev-soc-fill"
          style={{
            width: `${socProgress}%`,
          }}
        />
      </div>

      <div className="ev-card-body">
        <InfoRow
          label="SOC"
          value={`${session.current_soc}% -> ${session.target_soc}%`}
        />

        <InfoRow
          label="Battery"
          value={`${session.battery_kwh} kWh`}
        />

        <InfoRow
          label="Deadline"
          value={`${session.deadline_hour}:00`}
        />

        <InfoRow
          label="Max charging"
          value={`${session.max_charging_kw} kW`}
        />
      </div>
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="ev-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default EVSessionCard;
