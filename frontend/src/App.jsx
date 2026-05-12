import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import ChargingPortalPage from "./pages/ChargingPortalPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import AppShell from "./components/layout/AppShell";

const DEFAULT_TAB = "dashboard";
const DEFAULT_VIEW = "landing";

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("theme");

  const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : "dark";

  window.document.documentElement.setAttribute(
    "data-theme",
    initialTheme
  );

  return initialTheme;
}

export default function App() {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [view, setView] = useState(DEFAULT_VIEW);
  const [isStaffLoggedIn, setIsStaffLoggedIn] =
    useState(false);
  const [staffProfile, setStaffProfile] =
    useState(null);

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    window.document.documentElement.setAttribute("data-theme", theme);

    window.localStorage.setItem("theme", theme);
  }, [theme]);

  function handleToggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  function handleStaffLogin(profile) {
    setStaffProfile(profile);
    setIsStaffLoggedIn(true);
    setView("dashboard");
  }

  function handleStaffLogout() {
    setIsStaffLoggedIn(false);
    setStaffProfile(null);
    setView("landing");
    setActiveTab(DEFAULT_TAB);
  }

  if (view === "landing") {
    return (
      <div className="main-wrapper">
        <main className="main-content">
          <LandingPage
            onOpenChargingPortal={() =>
              setView("chargingPortal")
            }
            onOpenStaffLogin={() =>
              setView("staffLogin")
            }
          />
        </main>
      </div>
    );
  }

  if (view === "chargingPortal") {
    return (
      <div className="main-wrapper">
        <main className="main-content">
          <ChargingPortalPage
            onBackToLanding={() => setView("landing")}
            onOpenStaffLogin={() =>
              setView("staffLogin")
            }
          />
        </main>
      </div>
    );
  }

  if (
    view === "staffLogin" ||
    (view === "dashboard" && !isStaffLoggedIn)
  ) {
    return (
      <div className="main-wrapper">
        <main className="main-content">
          <StaffLoginPage
            onBackToLanding={() => setView("landing")}
            onLoginSuccess={handleStaffLogin}
          />
        </main>
      </div>
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      staffProfile={staffProfile}
      onOpenPublicSite={() => setView("landing")}
      onLogout={handleStaffLogout}
    >
      <Dashboard
        activeTab={activeTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </AppShell>
  );
}
