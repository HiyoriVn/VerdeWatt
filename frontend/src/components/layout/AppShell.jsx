import {
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  BatteryCharging,
  BarChart3,
  ShieldAlert,
  Bell,
  UserCircle2,
  Cpu,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function AppShell({ children }) {
  const [darkMode, setDarkMode] =
    useState(true);

  const [collapsed, setCollapsed] =
    useState(false);

  const [time, setTime] = useState(
    new Date()
  );

  const [language, setLanguage] =
    useState("English");

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
      icon: (
        <BatteryCharging size={18} />
      ),
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
                  item.active
                    ? "active"
                    : ""
                }`}
              >
                {item.icon}

                {!collapsed && (
                  <span>
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* FOOTER */}

        <div className="sidebar-footer">
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

          {/* COLLAPSE */}

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
            <h2>
              Energy Control Center
            </h2>

            <p>
              Smart charging orchestration
            </p>
          </div>

          {/* RIGHT */}

          <div className="topbar-right">
            {/* LANGUAGE */}

            <div className="dropdown-wrapper">
              <button className="topbar-btn">
                🌐

                <span>
                  {language}
                </span>
              </button>

              <div className="dropdown-menu">
                <button
                  className={`dropdown-item ${
                    language ===
                    "English"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setLanguage(
                      "English"
                    )
                  }
                >
                  🇺🇸 English
                </button>

                <button
                  className={`dropdown-item ${
                    language ===
                    "Tiếng Việt"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setLanguage(
                      "Tiếng Việt"
                    )
                  }
                >
                  🇻🇳 Tiếng Việt
                </button>
              </div>
            </div>

            {/* THEME SWITCH */}

            <div className="theme-switch-wrapper">
              <input
                type="checkbox"
                id="theme-toggle"
                checked={darkMode}
                onChange={() =>
                  setDarkMode(!darkMode)
                }
              />

              <label
                htmlFor="theme-toggle"
                className="theme-switch"
              >
                <Sun
                  className="sun-icon"
                  size={16}
              />

              <Moon
                className="moon-icon"
                size={16}
              />

                <span className="switch-ball"></span>
              </label>
            </div>

            {/* SYSTEM */}

            <div className="system-status">
              <Cpu size={16} />

              <span>
                System Online
              </span>
            </div>

            {/* TIME */}

            <div className="system-time">
              <strong>
                {time.toLocaleTimeString()}
              </strong>

              <p>
                {time.toLocaleDateString()}
              </p>
            </div>

            {/* NOTIFICATION */}

            <div className="dropdown-wrapper">
              <button className="icon-btn notification-btn">
                <Bell size={18} />

                <span className="notification-badge">
                  3
                </span>
              </button>

              <div className="notification-panel">
                <div className="notification-item high">
                  <strong>
                    Grid overload risk
                  </strong>

                  <p>
                    Peak load exceeded
                    safe threshold.
                  </p>
                </div>

                <div className="notification-item medium">
                  <strong>
                    Charging shifted
                  </strong>

                  <p>
                    EV_003 moved to
                    off-peak slot.
                  </p>
                </div>

                <div className="notification-item low">
                  <strong>
                    System healthy
                  </strong>

                  <p>
                    All charging
                    stations operational.
                  </p>
                </div>
              </div>
            </div>
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