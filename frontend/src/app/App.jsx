import { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import Dashboard from "../pages/staff/Dashboard";
import LandingPage from "../pages/public/LandingPage";
import ChargingPortalPage from "../pages/public/ChargingPortalPage";
import AppShell from "../components/layout/AppShell";

const DEFAULT_TAB = "dashboard";
const STAFF_SESSION_KEY = "verdewatt_staff_session";

const ALLOWED_TABS = [
  "dashboard",
  "charging-sessions",
  "analytics",
  "allocation",
  "billing-energy",
  "security",
  "settings",
];

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("theme");

  const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : "light";

  window.document.documentElement.setAttribute(
    "data-theme",
    initialTheme
  );

  return initialTheme;
}

export default function App() {
  const [staffProfile, setStaffProfile] = useState(
    getInitialStaffSession
  );

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

  const isStaffLoggedIn = Boolean(staffProfile);

  const handleStaffLogin = useCallback((profile) => {
    const nextProfile = normalizeStaffProfile(profile);
    window.localStorage.setItem(
      STAFF_SESSION_KEY,
      JSON.stringify(nextProfile)
    );
    setStaffProfile(nextProfile);
  }, []);

  const handleStaffLogout = useCallback(() => {
    window.localStorage.removeItem(STAFF_SESSION_KEY);
    setStaffProfile(null);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicPageLayout>
              <LandingPage />
            </PublicPageLayout>
          }
        />
        <Route
          path="/portal"
          element={
            <PublicPageLayout>
              <ChargingPortalPage
                onLoginSuccess={handleStaffLogin}
              />
            </PublicPageLayout>
          }
        />
        <Route
          path="/login"
          element={
            isStaffLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/portal?tab=staff" replace />
            )
          }
        />
        <Route
          path="/logout"
          element={
            <LogoutRoute
              onLogout={handleStaffLogout}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardRoute
              isStaffLoggedIn={isStaffLoggedIn}
              staffProfile={staffProfile}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          }
        />
        <Route
          path="/dashboard/:tab"
          element={
            <DashboardRoute
              isStaffLoggedIn={isStaffLoggedIn}
              staffProfile={staffProfile}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          }
        />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

function getInitialStaffSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(
      STAFF_SESSION_KEY
    );

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    return normalizeStaffProfile(parsed);
  } catch {
    return null;
  }
}

function normalizeStaffProfile(profile) {
  return {
    email:
      String(profile?.email || "").trim() ||
      "admin@verdewatt.vn",
    buildingCode:
      String(profile?.buildingCode || "").trim() ||
      "VDW_TOWER_01",
    role: "Building Manager",
  };
}

function normalizeTab(tab) {
  if (!tab) {
    return DEFAULT_TAB;
  }

  return ALLOWED_TABS.includes(tab)
    ? tab
    : DEFAULT_TAB;
}

function tabToPath(tab) {
  const safeTab = normalizeTab(tab);

  if (safeTab === DEFAULT_TAB) {
    return "/dashboard";
  }

  return `/dashboard/${safeTab}`;
}

function PublicPageLayout({ children }) {
  return (
    <div className="main-wrapper public-flow">
      <main className="main-content">{children}</main>
    </div>
  );
}

function LogoutRoute({ onLogout }) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    onLogout();
    setIsDone(true);
  }, [onLogout]);

  if (!isDone) {
    return null;
  }

  return <Navigate to="/" replace />;
}

function DashboardRoute({
  isStaffLoggedIn,
  staffProfile,
  theme,
  onToggleTheme,
}) {
  const navigate = useNavigate();
  const params = useParams();
  const requestedTab = params.tab;
  const activeTab = normalizeTab(requestedTab);

  if (!isStaffLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requestedTab && requestedTab !== activeTab) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleTabChange(nextTab) {
    navigate(tabToPath(nextTab));
  }

  function handleOpenPublicSite() {
    navigate("/");
  }

  function handleLogoutClick() {
    navigate("/logout");
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={handleTabChange}
      staffProfile={staffProfile}
      onOpenPublicSite={handleOpenPublicSite}
      onLogout={handleLogoutClick}
    >
      <Dashboard
        activeTab={activeTab}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
    </AppShell>
  );
}
