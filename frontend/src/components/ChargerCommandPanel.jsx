import React, { useEffect, useState } from "react";

import { getChargerCommands } from "../services/api";

function ChargerCommandPanel() {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCommands() {
      try {
        const data = await getChargerCommands();
        setCommands(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load charger commands right now.");
      } finally {
        setLoading(false);
      }
    }

    loadCommands();
  }, []);

  if (loading) {
    return <p>Loading charger commands...</p>;
  }

  if (error) {
    return <p style={{ color: "#b91c1c" }}>{error}</p>;
  }

  if (!commands.length) {
    return <p>No charger commands available.</p>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
      {commands.map((cmd, index) => (
        <div
          key={`${cmd.charger_id}-${cmd.related_ev_id || "none"}-${cmd.command}-${index}`}
          style={{ border: "1px solid #dbe3ef", borderRadius: 10, background: "#fff", padding: 10 }}
        >
          <p style={{ margin: "0 0 5px" }}><strong>Charger:</strong> {cmd.charger_id}</p>
          <p style={{ margin: "0 0 5px" }}><strong>EV:</strong> {cmd.related_ev_id || "N/A"}</p>
          <p style={{ margin: "0 0 5px" }}><strong>Command:</strong> {cmd.command}</p>
          <p style={{ margin: "0 0 5px" }}>
            <strong>Max Current (A):</strong> {cmd.max_current_amp ?? "N/A"}
          </p>
          <p style={{ margin: 0 }}><strong>Reason:</strong> {cmd.reason}</p>
        </div>
      ))}
    </div>
  );
}

export default ChargerCommandPanel;
