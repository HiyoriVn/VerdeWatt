import React, { useEffect, useState } from "react";

import { getSchedule } from "../services/api";

function ScheduleRecommendations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await getSchedule();
        setRows(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load schedule recommendations right now.");
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, []);

  if (loading) {
    return <p>Loading schedule recommendations...</p>;
  }

  if (error) {
    return <p style={{ color: "#b91c1c" }}>{error}</p>;
  }

  if (!rows.length) {
    return <p>No schedule recommendations available.</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={thStyle}>Vehicle</th>
            <th style={thStyle}>Priority</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Recommended Action</th>
            <th style={thStyle}>Estimated Completion Hour</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.vehicle_id}>
              <td style={tdStyle}>{row.vehicle_id}</td>
              <td style={tdStyle}>{row.priority}</td>
              <td style={tdStyle}>{row.status}</td>
              <td style={tdStyle}>{row.recommended_action}</td>
              <td style={tdStyle}>{row.estimated_completion_hour ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  border: "1px solid #dbe3ef",
  padding: "8px",
  fontSize: 13,
};

const tdStyle = {
  border: "1px solid #e5e7eb",
  padding: "8px",
  fontSize: 13,
  verticalAlign: "top",
};

export default ScheduleRecommendations;
