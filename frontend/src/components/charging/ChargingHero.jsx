import {
  BatteryCharging,
  Clock3,
  Gauge,
  Zap,
} from "lucide-react";

function StatCard({
  icon,
  value,
  label,
}) {
  return (
    <div className="charging-hero-stat">

      <div className="charging-hero-icon">
        {icon}
      </div>

      <div>
        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>
      </div>

    </div>
  );
}

export default function ChargingHero({
  sessions = [],
}) {
  const activeCount =
    sessions.length;

  const urgentCount =
    sessions.filter(
      (s) =>
        String(
          s.priority
        ).toLowerCase() ===
        "urgent"
    ).length;

  const avgSoc =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (sum, s) =>
              sum +
              Number(
                s.current_soc ??
                  0
              ),
            0
          ) / sessions.length
        )
      : 0;

  const totalPower =
    sessions.reduce(
      (sum, s) =>
        sum +
        Number(
          s.max_charging_kw ??
            0
        ),
      0
    );

  return (
    <section className="charging-hero">

      <div className="charging-hero-content">

        <div className="charging-hero-badge">
          <Zap size={15} />
          Charging Network Active
        </div>

        <h1>
          Charging Operations
          Center
        </h1>

        <p>
          Monitor EV charging,
          prioritize urgent
          vehicles and optimize
          energy allocation in
          real time.
        </p>

      </div>

      <div className="charging-hero-stats">

        <StatCard
          icon={
            <BatteryCharging
              size={18}
            />
          }
          value={activeCount}
          label="Active EVs"
        />

        <StatCard
          icon={
            <Clock3
              size={18}
            />
          }
          value={urgentCount}
          label="Urgent Sessions"
        />

        <StatCard
          icon={<Gauge size={18} />}
          value={`${avgSoc}%`}
          label="Average SOC"
        />

        <StatCard
          icon={<Zap size={18} />}
          value={`${totalPower}kW`}
          label="Max Capacity"
        />

      </div>

    </section>
  );
}