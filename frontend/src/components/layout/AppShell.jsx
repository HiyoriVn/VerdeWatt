// src/components/layout/AppShell.jsx

import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({
  children,
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
}) {
  const [isCollapsed, setIsCollapsed] =
    useState(false);

  function handleToggleCollapse() {
    setIsCollapsed(
      (prev) => !prev
    );
  }

  return (
    <div
      className={`app-shell ${
        isCollapsed
          ? "collapsed"
          : ""
      }`}
    >
      <Sidebar
        activeTab={activeTab}
        onTabChange={
          onTabChange
        }
        isCollapsed={
          isCollapsed
        }
        onToggleCollapse={
          handleToggleCollapse
        }
      />

      <div className="main-wrapper">
        <Topbar
          theme={theme}
          onToggleTheme={
            onToggleTheme
          }
        />

        <main className="main-content">
          <div className="content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}