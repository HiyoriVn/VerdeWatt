import {
  Search,
  Clock3,
  Wallet,
  Leaf,
  ShieldCheck,
} from "lucide-react";

import chargingSessions from "../../data/chargingSessions";

export default function VehicleLookup({
  selectedVehicle,
}) {

  const vehicle =
    chargingSessions.find(
      (v) =>
        v.id ===
        selectedVehicle
    ) ||
    chargingSessions[0];

  return (
    <div className="vehicle-lookup-card">

      <div className="vehicle-lookup-header">
        <h3>
          Vehicle Intelligence
        </h3>

        <p>
          Smart charging
          recommendation
        </p>
      </div>

      <div className="vehicle-result-card">

        <div className="vehicle-result-top">
          <div>
            <span>
              Vehicle
            </span>

            <h2>
              {vehicle.id}
            </h2>
          </div>

          <div className="vehicle-status">
            {
              vehicle.priority
            }
          </div>
        </div>

        <p className="vehicle-message">
          Vehicle requires
          optimized charging
          strategy based on
          SOC and deadline.
        </p>

        <div className="vehicle-metrics">

          <div className="vehicle-metric">
            <Clock3 size={16} />

            <div>
              <span>
                Deadline
              </span>

              <strong>
                {
                  vehicle.deadline
                }
              </strong>
            </div>
          </div>

          <div className="vehicle-metric">
            <Wallet size={16} />

            <div>
              <span>
                Battery
              </span>

              <strong>
                {
                  vehicle.battery
                }
              </strong>
            </div>
          </div>

          <div className="vehicle-metric">
            <Leaf size={16} />

            <div>
              <span>
                SOC
              </span>

              <strong>
                {
                  vehicle.soc
                }
              </strong>
            </div>
          </div>

          <div className="vehicle-metric">
            <ShieldCheck size={16} />

            <div>
              <span>
                Max Charging
              </span>

              <strong>
                {
                  vehicle.maxCharging
                }
              </strong>
            </div>
          </div>

        </div>

        <div className="vehicle-footer-note">
          Selected vehicle:
          {" "}
          {vehicle.id}
        </div>

      </div>
    </div>
  );
}