import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";
import AppShell from "./components/layout/AppShell";

const DEFAULT_TAB = "dashboard";

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

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <Dashboard
        activeTab={activeTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </AppShell>
  );
}
