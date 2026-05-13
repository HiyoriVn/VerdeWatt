import React from "react";

function ChargingEVSessionCard({ session, isSelected }) {
  const priorityKey = String(session?.priority || "normal").toLowerCase();

  const currentSoc = Number(session?.current_soc ?? 0);
  const targetSoc = Number(session?.target_soc ?? 100);

  return (
    <article
      className={`ev-card-new ev-card-bg-${priorityKey} ${isSelected ? "selected" : ""}`}
    >
      <div className="ev-card-top">
        <h3>{session.id}</h3>
        <span className={`ev-priority-badge priority-${priorityKey}`}>
          {priorityKey}
        </span>
      </div>

      <div className="ev-card-body-new">
        <InfoRow label="SOC" value={`${currentSoc}% \u2192 ${targetSoc}%`} />
        <InfoRow label="Battery" value={`${session.battery_kwh}kWh`} />
        <InfoRow label="Deadline" value={`${session.deadline_hour}:00`} />
        <InfoRow label="Max charging" value={`${session.max_charging_kw}kW`} />
      </div>
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="ev-info-row-new">
      <span className="info-label">{label}</span>
      <strong className="info-value">{value}</strong>
    </div>
  );
}

export default ChargingEVSessionCard;
