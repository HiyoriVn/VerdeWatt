import {
  BarChart3,
  BatteryCharging,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldAlert,
  UserRound,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "charging-sessions",
    label: "Charging Sessions",
    icon: BatteryCharging,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "allocation",
    label: "Allocation",
    icon: Zap,
  },
  {
    id: "billing-energy",
    label: "Billing & Energy",
    icon: Receipt,
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldAlert,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AppShell({
  children,
  activeTab,
  onTabChange,
  staffProfile,
  onOpenPublicSite,
  onLogout,
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-area">
            <div className="brand-logo">
              <Zap size={22} />
            </div>

            <div className="brand-text">
              <h2>VerdeWatt</h2>
              <p>Smart EV Infrastructure</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`sidebar-nav-item ${
                    activeTab === item.id
                      ? "sidebar-nav-item-active"
                      : ""
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <UserRound size={20} />
          </div>

          <div>
            <strong>
              {staffProfile?.email || "Admin"}
            </strong>
            <p>
              {staffProfile?.buildingCode
                ? `Building ${staffProfile.buildingCode}`
                : "Building Manager"}
            </p>
          </div>
        </div>

        <div className="sidebar-public-actions">
          <button
            type="button"
            className="sidebar-mini-btn"
            onClick={onOpenPublicSite}
          >
            Public Site
          </button>
          <button
            type="button"
            className="sidebar-mini-btn"
            onClick={onLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
