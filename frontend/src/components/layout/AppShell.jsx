import {
  LayoutDashboard,
  BatteryCharging,
  BarChart3,
  ShieldAlert,
  Moon,
  Sun,
} from "lucide-react";

import { useEffect, useState } from "react";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "charging",
    label: "Charging",
    icon: BatteryCharging,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldAlert,
  },
];

export default function AppShell({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          {/* LOGO */}

          <div className="logo">
            <h2>VerdeWatt</h2>

            <p>
              Smart EV charging
              <br />
              & cyber defense platform
            </p>
          </div>

          {/* SECTION TITLE */}

          <div className="sidebar-section-title">
            Navigation
          </div>

          {/* NAVIGATION */}

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  className={`nav-btn ${
                    activeTab === item.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <>
                <Sun size={18} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={18} />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}