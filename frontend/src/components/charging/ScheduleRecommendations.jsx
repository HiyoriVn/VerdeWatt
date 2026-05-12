import React, { useEffect, useState } from "react";

import { getSchedule } from "../../services/api";

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
        setError(
          "Could not load schedule recommendations right now."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, []);

  if (loading) {
    return (
      <p className="dashboard-muted">
        Loading schedule recommendations...
      </p>
    );
  }

  if (error) {
    return (
      <p
        style={{
          color: "var(--danger)",
          fontWeight: 600,
        }}
      >
        {error}
      </p>
    );
  }

  if (!rows.length) {
    return (
      <p className="dashboard-muted">
        No schedule recommendations available.
      </p>
    );
  }

  return (
    <div className="schedule-table-wrapper">
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Recommended Action</th>
            <th>Completion Hour</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.vehicle_id}>
              <td>{row.vehicle_id}</td>

              <td>
                <PriorityBadge priority={row.priority} />
              </td>

              <td>{row.status}</td>

              <td>{row.recommended_action}</td>

              <td>
                {row.estimated_completion_hour ?? "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const value = String(priority || "").toLowerCase();

  let className = "priority-badge";

  if (value === "urgent") {
    className += " urgent";
  } else if (value === "normal") {
    className += " normal";
  } else {
    className += " flexible";
  }

  return (
    <span className={className}>
      {priority}
    </span>
  );
}

export default ScheduleRecommendations;