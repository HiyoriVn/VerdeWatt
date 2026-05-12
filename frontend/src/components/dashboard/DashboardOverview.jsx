import {
  Activity,
  ShieldCheck,
  Cpu,
  Clock3,
} from "lucide-react";

function DashboardOverview({
  children,
}) {
  const now = new Date();

  return (
    <div className="dashboard-page">
      {/* HEADER */}

      <section className="dashboard-header">
        <div>
          <h1>Energy Control Center</h1>

          <p>
            Real-time EV charging monitoring,
            smart allocation, grid analytics
            and infrastructure protection.
          </p>
        </div>

        <div className="dashboard-header-right">
          <div className="live-meta glass-card">
            <div>
              <Activity size={14} />
              <span>Grid Status:</span>
              <strong>Stable</strong>
            </div>

            <div>
              <ShieldCheck size={14} />
              <span>Security:</span>
              <strong>Protected</strong>
            </div>
          </div>

          <div className="live-meta glass-card">
            <div>
              <Cpu size={14} />
              <span>AI Optimizer:</span>
              <strong>Online</strong>
            </div>

            <div>
              <Clock3 size={14} />
              <span>
                {now.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}

export default DashboardOverview;