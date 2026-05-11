import React, { useState } from "react";

import { getVehicle } from "../services/api";

function VehicleLookup() {
  const [vehicleCode, setVehicleCode] = useState("EV_001");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    const code = vehicleCode.trim();
    if (!code) {
      setError("Please enter a vehicle code.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getVehicle(code);
      setResult(data);
    } catch (err) {
      const message = String(err?.message || "");
      if (message.toLowerCase().includes("vehicle code not found")) {
        setError("Vehicle code not found. Try EV_001.");
      } else {
        setError("Could not load vehicle recommendation right now.");
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          type="text"
          value={vehicleCode}
          onChange={(e) => setVehicleCode(e.target.value)}
          placeholder="e.g. EV_001"
          style={{
            padding: "8px 10px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            minWidth: 220,
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #2563eb",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ margin: "0 0 10px", color: "#b91c1c" }}>{error}</p>}

      {result && (
        <div style={{ border: "1px solid #d9e3f0", borderRadius: 10, padding: 12, background: "#fff" }}>
          <p style={{ margin: "0 0 6px" }}><strong>Vehicle:</strong> {result.vehicle_id}</p>
          <p style={{ margin: "0 0 6px" }}><strong>Status:</strong> {result.status}</p>
          <p style={{ margin: "0 0 6px" }}><strong>Recommended Action:</strong> {result.recommended_action}</p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Estimated Completion Hour:</strong> {result.estimated_completion_hour ?? "N/A"}
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Estimated Cost (VND):</strong> {Number(result.estimated_cost_vnd ?? 0).toLocaleString()}
          </p>
          <p style={{ margin: "0 0 6px" }}>
            <strong>Estimated Saving (VND):</strong> {Number(result.estimated_saving_vnd ?? 0).toLocaleString()}
          </p>
          <p style={{ margin: 0 }}><strong>Message:</strong> {result.user_message}</p>
        </div>
      )}
    </div>
  );
}

export default VehicleLookup;
