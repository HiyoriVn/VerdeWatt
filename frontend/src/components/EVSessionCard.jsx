import React from "react";

function EVSessionCard({ session }) {
  const priorityColor = {
    urgent: "#ef4444",
    normal: "#f59e0b",
    flexible: "#3b82f6",
  };

  return (
    <div className="dashboard-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          marginBottom: 18,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "var(--text)",
          }}
        >
          {session.id}
        </h3>

        <span
          style={{
            padding: "6px 10px",

            borderRadius: 999,

            fontSize: 12,
            fontWeight: 600,

            background:
              priorityColor[
                session.priority
              ] + "20",

            color:
              priorityColor[
                session.priority
              ],
          }}
        >
          {session.priority}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <InfoRow
          label="SOC"
          value={`${session.current_soc}% → ${session.target_soc}%`}
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
          label="Max Charging"
          value={`${session.max_charging_kw} kW`}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        gap: 12,
      }}
    >
      <span
        style={{
          color: "var(--text-soft)",
          fontSize: 14,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "var(--text)",
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default EVSessionCard;