// src/components/layout/Sidebar.jsx

import {
  BarChart3,
  BatteryCharging,
  ChevronLeft,
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
    label:
      "Charging Sessions",
    icon:
      BatteryCharging,
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
    label:
      "Billing & Energy",
    icon: Receipt,
  },
  {
    id: "security",
    label: "Security",
    icon:
      ShieldAlert,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
}) {
  return (
    <aside
      className={`sidebar ${
        isCollapsed
          ? "collapsed"
          : ""
      }`}
    >
      {/* TOP */}

      <div className="sidebar-top">

        {/* BRAND */}

        <div className="brand-area">
          <div className="brand-logo">
            <Zap size={22} />
          </div>

          {!isCollapsed && (
            <div className="brand-text">
              <h2>
                VerdeWatt
              </h2>

              <p>
                Smart EV
                Infrastructure
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(
            (item) => {
              const Icon =
                item.icon;

              const isActive =
                activeTab ===
                item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  title={
                    isCollapsed
                      ? item.label
                      : ""
                  }
                  onClick={() =>
                    onTabChange(
                      item.id
                    )
                  }
                  className={`sidebar-nav-item ${
                    isActive
                      ? "sidebar-nav-item-active"
                      : ""
                  }`}
                >
                  <span className="nav-icon">
                    <Icon
                      size={18}
                      strokeWidth={
                        isActive
                          ? 2.4
                          : 2
                      }
                    />
                  </span>

                  {!isCollapsed && (
                    <span className="nav-label">
                      {
                        item.label
                      }
                    </span>
                  )}
                </button>
              );
            }
          )}
        </nav>
      </div>

      {/* BOTTOM */}

      <div className="sidebar-bottom">

        {/* USER */}

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <UserRound
              size={18}
            />
          </div>

          {!isCollapsed && (
            <div className="sidebar-user-info">
              <strong>
                Admin
              </strong>

              <p>
                Building
                Manager
              </p>
            </div>
          )}
        </div>

        {/* COLLAPSE */}

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={
            onToggleCollapse
          }
          title={
            isCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          <span
            className={`toggle-icon ${
              isCollapsed
                ? "rotated"
                : ""
            }`}
          >
            <ChevronLeft
              size={18}
            />
          </span>

          {!isCollapsed && (
            <span className="toggle-text">
              Collapse
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}