import {
  BatteryCharging,
  Clock3,
  Zap,
} from "lucide-react";

function EVSessionCard({
  session,
}) {
  const priorityKey = String(
    session?.priority || "normal"
  ).toLowerCase();

  const priorityClassMap = {
    urgent: "priority-urgent",
    normal: "priority-normal",
    flexible:
      "priority-flexible",
  };

  const priorityClass =
    priorityClassMap[
      priorityKey
    ] || "priority-normal";

  return (
    <article
      className={`ev-card ${priorityClass}`}
    >
      {/* HEADER */}
      <div className="ev-card-top">

        <h3>
          {session.id}
        </h3>

        <span
          className={`ev-priority-badge ${priorityClass}`}
        >
          {priorityKey}
        </span>
      </div>

      {/* BODY */}
      <div className="ev-card-body">

        <div className="ev-info-row">
          <span>
            <BatteryCharging
              size={14}
            />
            SOC
          </span>

          <strong>
            {session.soc}
          </strong>
        </div>

        <div className="ev-info-row">
          <span>
            Battery
          </span>

          <strong>
            {
              session.battery
            }
          </strong>
        </div>

        <div className="ev-info-row">
          <span>
            <Clock3
              size={14}
            />
            Deadline
          </span>

          <strong>
            {
              session.deadline
            }
          </strong>
        </div>

        <div className="ev-info-row">
          <span>
            <Zap size={14} />
            Max charging
          </span>

          <strong>
            {
              session.maxCharging
            }
          </strong>
        </div>

      </div>
    </article>
  );
}

export default EVSessionCard;