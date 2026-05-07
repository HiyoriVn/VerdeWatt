import React from "react";

function EVSessionCard({ session }) {
  const cardStyle = {
    border: "1px solid #d9e3f0",
    borderRadius: "10px",
    padding: "12px",
    backgroundColor: "#ffffff",
  };

  const priorityColor = {
    urgent: "#b91c1c",
    normal: "#1f2937",
    flexible: "#0369a1",
  };

  return (
    <div style={cardStyle}>
      <h4 style={{ marginTop: 0, marginBottom: 8 }}>{session.id}</h4>
      <p style={{ margin: "4px 0" }}>SOC: {session.current_soc}% -> {session.target_soc}%</p>
      <p style={{ margin: "4px 0" }}>Battery: {session.battery_kwh} kWh</p>
      <p style={{ margin: "4px 0" }}>Deadline: {session.deadline_hour}:00</p>
      <p style={{ margin: "4px 0" }}>Max Charging: {session.max_charging_kw} kW</p>
      <p style={{ margin: "4px 0", color: priorityColor[session.priority] || "#111827" }}>
        Priority: {session.priority}
      </p>
    </div>
  );
}

export default EVSessionCard;
