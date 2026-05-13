import { useState } from "react";
import {
  BarChart3,
  BatteryCharging,
  Globe,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const SidebarToggleIcon = isSidebarCollapsed
    ? PanelLeftOpen
    : PanelLeftClose;

  return (
    <div
      className={`app-shell ${
        isSidebarCollapsed
          ? "app-shell-collapsed"
          : ""
      }`}
    >
      <aside
        className={`sidebar ${
          isSidebarCollapsed
            ? "sidebar-collapsed"
            : ""
        }`}
      >
        <div className="sidebar-main">
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
                  title={item.label}
                  className={`sidebar-nav-item ${
                    activeTab === item.id
                      ? "sidebar-nav-item-active"
                      : ""
                  }`}
                >
                  <Icon size={18} />
                  <span className="sidebar-nav-label">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-user-info">
              <div className="sidebar-user-avatar">
                <UserRound size={20} />
              </div>

              <div className="sidebar-user-meta">
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
                title="Public Site"
              >
                <Globe size={14} />
                <span>Public Site</span>
              </button>
              <button
                type="button"
                className="sidebar-mini-btn"
                onClick={onLogout}
                title="Sign Out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="sidebar-toggle-row">
            <button
              type="button"
              className="sidebar-collapse-btn"
              onClick={() =>
                setIsSidebarCollapsed(
                  (currentValue) =>
                    !currentValue
                )
              }
              aria-label={
                isSidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
            >
              <SidebarToggleIcon size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
