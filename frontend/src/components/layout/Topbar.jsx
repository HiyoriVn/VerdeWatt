// src/components/layout/Topbar.jsx

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  CalendarDays,
  EllipsisVertical,
  Moon,
  SunMedium,
} from "lucide-react";

export default function Topbar({
  theme,
  onToggleTheme,
}) {
  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [
    currentTime,
    setCurrentTime,
  ] = useState(new Date());

  const notifRef =
    useRef(null);

  /* CLOCK */

  useEffect(() => {
    const timer =
      setInterval(() => {
        setCurrentTime(
          new Date()
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  /* CLICK OUTSIDE */

  useEffect(() => {
    function handleClickOutside(
      event
    ) {
      if (
        notifRef.current &&
        !notifRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(
          false
        );
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const notifications = [
    {
      id: 1,
      title:
        "Abnormal power request",
      desc:
        "Session EV_999 requested 120.0 kW.",
      time: "2m ago",
    },
    {
      id: 2,
      title:
        "Charger offline",
      desc:
        "CHG-B2 lost connection.",
      time: "15m ago",
    },
    {
      id: 3,
      title:
        "Suspicious session",
      desc:
        "EV_998 flagged for review.",
      time: "28m ago",
    },
  ];

  return (
    <header className="app-topbar">
      {/* LEFT */}

      <div className="topbar-left">
        <h1 className="page-title">
          Energy Control Center
        </h1>

        <p className="page-subtitle">
          Real-time EV charging
          monitoring &
          optimization
        </p>
      </div>

      {/* RIGHT */}

      <div className="topbar-right">

        {/* DATE TIME */}

        <div className="datetime-card">
          <CalendarDays
            size={18}
            className="datetime-icon"
          />

          <div className="datetime-info">
            <span className="date">
              {currentTime.toLocaleDateString(
                "en-US",
                {
                  weekday:
                    "short",
                  month:
                    "short",
                  day:
                    "numeric",
                }
              )}
            </span>

            <strong className="time">
              {currentTime.toLocaleTimeString(
                "en-US",
                {
                  hour:
                    "2-digit",
                  minute:
                    "2-digit",
                }
              )}
            </strong>
          </div>
        </div>

        {/* THEME SWITCH */}

        <button
          type="button"
          className="theme-switch"
          onClick={
            onToggleTheme
          }
        >
          <SunMedium
            size={16}
          />

          <Moon
            size={16}
          />

          <div
            className={`switch-thumb ${
              theme ===
              "dark"
                ? "dark"
                : ""
            }`}
          />
        </button>

        {/* NOTIFICATIONS */}

        <div
          className="notif-wrapper"
          ref={notifRef}
        >
          <button
            type="button"
            className="topbar-square-btn"
            onClick={() =>
              setShowNotifications(
                (
                  prev
                ) => !prev
              )
            }
          >
            <Bell size={18} />

            <span className="notif-count">
              {
                notifications.length
              }
            </span>
          </button>

          {showNotifications && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h4>
                  Notifications
                </h4>

                <button className="mark-read-btn">
                  Mark all
                </button>
              </div>

              <div className="notif-list">
                {notifications.map(
                  (
                    item
                  ) => (
                    <div
                      key={
                        item.id
                      }
                      className="notif-item"
                    >
                      <div className="notif-dot" />

                      <div className="notif-content">
                        <strong>
                          {
                            item.title
                          }
                        </strong>

                        <p>
                          {
                            item.desc
                          }
                        </p>
                      </div>

                      <span className="notif-time">
                        {
                          item.time
                        }
                      </span>
                    </div>
                  )
                )}
              </div>

              <button className="notif-footer">
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* MORE */}

        <button
          type="button"
          className="topbar-square-btn"
        >
          <EllipsisVertical
            size={18}
          />
        </button>
      </div>
    </header>
  );
}