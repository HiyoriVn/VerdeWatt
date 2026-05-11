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

      if (
        message
          .toLowerCase()
          .includes("vehicle code not found")
      ) {
        setError(
          "Vehicle code not found. Try EV_001."
        );
      } else {
        setError(
          "Could not load vehicle recommendation right now."
        );
      }

      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vehicle-lookup">
      <div className="vehicle-search-bar">
        <input
          type="text"
          value={vehicleCode}
          onChange={(e) =>
            setVehicleCode(e.target.value)
          }
          placeholder="e.g. EV_001"
          className="vehicle-input"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="vehicle-search-btn"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="vehicle-error">
          {error}
        </p>
      )}

      {result && (
        <div className="vehicle-result-card">
          <div className="vehicle-result-header">
            <div>
              <h3>{result.vehicle_id}</h3>

              <p>
                Smart charging recommendation
              </p>
            </div>

            <StatusBadge
              status={result.status}
            />
          </div>

          <div className="vehicle-result-grid">
            <InfoItem
              label="Recommended Action"
              value={result.recommended_action}
            />

            <InfoItem
              label="Completion Hour"
              value={
                result.estimated_completion_hour ??
                "N/A"
              }
            />

            <InfoItem
              label="Estimated Cost"
              value={`${Number(
                result.estimated_cost_vnd ?? 0
              ).toLocaleString()} VND`}
            />

            <InfoItem
              label="Estimated Saving"
              value={`${Number(
                result.estimated_saving_vnd ?? 0
              ).toLocaleString()} VND`}
            />
          </div>

          <div className="vehicle-message-box">
            <strong>Message</strong>

            <p>{result.user_message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="vehicle-info-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const value = String(status || "").toLowerCase();

  let className = "vehicle-status";

  if (value.includes("charging")) {
    className += " charging";
  } else if (value.includes("waiting")) {
    className += " waiting";
  } else {
    className += " idle";
  }

  return (
    <div className={className}>
      {status}
    </div>
  );
}

export default VehicleLookup;