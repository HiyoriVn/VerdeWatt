import React, { useEffect, useState } from "react";

import { getChargerCommands } from "../services/api";

import {
  BatteryCharging,
  Zap,
  ShieldCheck,
} from "lucide-react";

function ChargerCommandPanel() {
  const [commands, setCommands] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadCommands() {
      try {
        const data =
          await getChargerCommands();

        setCommands(
          Array.isArray(data)
            ? data
            : []
        );
      } catch {
        setError(
          "Could not load charger commands right now."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCommands();
  }, []);

  if (loading) {
    return (
      <p className="muted-text">
        Loading charger commands...
      </p>
    );
  }

  if (error) {
    return (
      <p className="error-text">
        {error}
      </p>
    );
  }

  if (!commands.length) {
    return (
      <p className="muted-text">
        No charger commands available.
      </p>
    );
  }

  return (
    <div className="card-grid">
      {commands.map((cmd, index) => (
        <div
          key={`${cmd.charger_id}-${cmd.related_ev_id || "none"}-${cmd.command}-${index}`}
          className="dashboard-card charger-card"
        >
          <div className="charger-header">
            <div className="charger-icon">
              <BatteryCharging size={18} />
            </div>

            <div>
              <h4>
                {cmd.charger_id}
              </h4>

              <p>
                EV:
                {" "}
                {cmd.related_ev_id ||
                  "N/A"}
              </p>
            </div>
          </div>

          <div className="charger-details">
            <div className="charger-row">
              <Zap size={15} />

              <span>
                Command:
                {" "}
                <strong>
                  {cmd.command}
                </strong>
              </span>
            </div>

            <div className="charger-row">
              <ShieldCheck size={15} />

              <span>
                Max Current:
                {" "}
                <strong>
                  {cmd.max_current_amp ??
                    "N/A"}{" "}
                  A
                </strong>
              </span>
            </div>
          </div>

          <div className="charger-reason">
            <p>
              {cmd.reason}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChargerCommandPanel;