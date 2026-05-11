import {
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  BatteryCharging,
  BarChart3,
  ShieldAlert,
  Globe,
  Bell,
  UserCircle2,
  Cpu,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function AppShell({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  const [collapsed, setCollapsed] = useState(false);

  const [time, setTime] = useState(
    new Date()
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      active: true,
    },
    {
      label: "Charging",
      icon: <BatteryCharging size={18} />,
    },
    {
      label: "Analytics",
      icon: <BarChart3 size={18} />,
    },
    {
      label: "Security",
      icon: <ShieldAlert size={18} />,
    },
  ];

  return (
    <div className="app-shell">
      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          collapsed ? "collapsed" : ""
        }`}
      >
        {/* TOP */}

        <div>
          {/* BRAND */}

          <div className="brand-area">
            <div className="brand-logo">
              ⚡
            </div>

            {!collapsed && (
              <div className="brand-text">
                <h2>VerdeWatt</h2>

                <p>
                  Smart EV Platform
                </p>
              </div>
            )}
          </div>

          {/* NAVIGATION */}

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-btn ${
                  item.active ? "active" : ""
                }`}
              >
                {item.icon}

                {!collapsed && (
                  <span>{item.label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* BOTTOM */}

        <div className="sidebar-footer">
          <button className="nav-btn">
            <Globe size={18} />

            {!collapsed && (
              <span>EN / VI</span>
            )}
          </button>

          <button
            className="nav-btn"
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}

            {!collapsed && (
              <span>
                {darkMode
                  ? "Light Mode"
                  : "Dark Mode"}
              </span>
            )}
          </button>

          {/* USER */}

          <div className="user-mini-card">
            <UserCircle2 size={38} />

            {!collapsed && (
              <div>
                <strong>
                  Admin Panel
                </strong>

                <p>
                  System Administrator
                </p>
              </div>
            )}
          </div>

          {/* COLLAPSE BUTTON */}

          <button
            className="collapse-btn"
            onClick={() =>
              setCollapsed(!collapsed)
            }
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}

            {!collapsed && (
              <span>
                Collapse Sidebar
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <div className="main-wrapper">
        {/* TOPBAR */}

        <header className="topbar">
          <div>
            <h2>Energy Control Center</h2>

            <p>
              Smart charging orchestration
            </p>
          </div>

          <div className="topbar-right">
            <div className="system-status">
              <Cpu size={16} />

              <span>
                System Online
              </span>
            </div>

            <div className="system-time">
              <strong>
                {time.toLocaleTimeString()}
              </strong>

              <p>
                {time.toLocaleDateString()}
              </p>
            </div>

            <button className="icon-btn">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* CONTENT */}

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}