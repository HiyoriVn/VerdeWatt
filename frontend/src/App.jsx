// src/App.jsx

import {
  useEffect,
  useState,
} from "react";

import AppShell from "./components/layout/AppShell";

import Dashboard from "./pages/Dashboard";
import Charging from "./pages/Charging";
import Analytics from "./pages/Analytics";
import Allocation from "./pages/Allocation";
import Billing from "./pages/Billing";
import Security from "./pages/Security";
import Settings from "./pages/Settings";

const DEFAULT_TAB =
  "dashboard";

function getInitialTheme() {
  if (
    typeof window ===
    "undefined"
  ) {
    return "dark";
  }

  const savedTheme =
    window.localStorage.getItem(
      "theme"
    );

  const theme =
    savedTheme === "light" ||
    savedTheme === "dark"
      ? savedTheme
      : "dark";

  window.document.documentElement.setAttribute(
    "data-theme",
    theme
  );

  return theme;
}

export default function App() {
  const [activeTab, setActiveTab] =
    useState(DEFAULT_TAB);

  const [theme, setTheme] =
    useState(
      getInitialTheme
    );

  useEffect(() => {
    window.document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    window.localStorage.setItem(
      "theme",
      theme
    );
  }, [theme]);

  function handleToggleTheme() {
    setTheme((prev) =>
      prev === "dark"
        ? "light"
        : "dark"
    );
  }

  function renderPage() {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            theme={theme}
            onToggleTheme={
              handleToggleTheme
            }
          />
        );

      case "charging-sessions":
        return (
          <Charging />
        );

      case "analytics":
        return (
          <Analytics />
        );

      case "allocation":
        return (
          <Allocation />
        );

      case "billing-energy":
        return (
          <Billing />
        );

      case "security":
        return (
          <Security />
        );

      case "settings":
        return (
          <Settings
            theme={theme}
            onToggleTheme={
              handleToggleTheme
            }
          />
        );

      default:
        return (
          <Dashboard
            theme={theme}
            onToggleTheme={
              handleToggleTheme
            }
          />
        );
    }
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={
        setActiveTab
      }
      theme={theme}
      onToggleTheme={
        handleToggleTheme
      }
    >
      {renderPage()}
    </AppShell>
  );
}