// src/pages/Charging.jsx

import { useMemo, useState } from "react";

import {
  Activity,
  BatteryCharging,
  Clock3,
  Zap,
  Search,
} from "lucide-react";

import VehicleLookup from "../components/charging/VehicleLookup";
import EVSessionCard from "../components/charging/EVSessionCard";
import chargingSessions from "../data/chargingSessions";

export default function Charging() {
  const [selectedVehicle, setSelectedVehicle] =
    useState("EV_001");

  const [searchInput, setSearchInput] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  /* ==========================
     KPI STATS
  ========================== */

  const activeCount =
    chargingSessions.length;

  const urgentCount =
    chargingSessions.filter(
      (s) =>
        s.priority ===
        "urgent"
    ).length;

  const avgSoc =
    Math.round(
      chargingSessions.reduce(
        (acc, s) =>
          acc +
          Number(
            String(s.soc)
              .split("%")[0]
          ),
        0
      ) / activeCount
    );

  const totalCapacity =
    chargingSessions.reduce(
      (acc, s) =>
        acc +
        Number(
          String(s.battery)
            .replace(
              "kWh",
              ""
            )
        ),
      0
    );

  /* ==========================
     SEARCH
  ========================== */

  const handleSearch = () => {
    const foundVehicle =
      chargingSessions.find(
        (session) =>
          session.id
            .toLowerCase()
            .trim() ===
          searchInput
            .toLowerCase()
            .trim()
      );

    if (!foundVehicle) {
      alert(
        "Vehicle not found."
      );
      return;
    }

    setSelectedVehicle(
      foundVehicle.id
    );
  };

  /* ==========================
     FILTER
  ========================== */

  const filteredSessions =
    useMemo(() => {
      return chargingSessions.filter(
        (session) => {
          const matchSearch =
            searchInput.trim() ===
            ""
              ? true
              : session.id
                  .toLowerCase()
                  .includes(
                    searchInput.toLowerCase()
                  );

          const matchFilter =
            filter === "all"
              ? true
              : session.priority ===
                filter;

          return (
            matchSearch &&
            matchFilter
          );
        }
      );
    }, [
      searchInput,
      filter,
    ]);

  return (
    <div className="dashboard-page charging-page">

      {/* HERO */}
      <section className="charging-hero">

        <div className="charging-hero-content">
          <div className="charging-hero-badge">
            ⚡ Charging Network Active
          </div>

          <h1>
            Charging Operations
            Center
          </h1>

          <p>
            Monitor EV charging,
            prioritize urgent
            vehicles and optimize
            charging allocation
            across the smart grid.
          </p>
        </div>

        <div className="charging-hero-stats">

          <div className="charging-hero-stat">
            <BatteryCharging size={20} />

            <div>
              <strong>
                {activeCount}
              </strong>

              <span>
                Active EVs
              </span>
            </div>
          </div>

          <div className="charging-hero-stat">
            <Clock3 size={20} />

            <div>
              <strong>
                {urgentCount}
              </strong>

              <span>
                Urgent Sessions
              </span>
            </div>
          </div>

          <div className="charging-hero-stat">
            <Activity size={20} />

            <div>
              <strong>
                {avgSoc}%
              </strong>

              <span>
                Average SOC
              </span>
            </div>
          </div>

          <div className="charging-hero-stat">
            <Zap size={20} />

            <div>
              <strong>
                {totalCapacity}kW
              </strong>

              <span>
                Max Capacity
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SMART OPTIMIZATION */}
      <section className="card charging-summary-card">
        <h3>
          Smart Charging
          Optimization
        </h3>

        <div className="charging-summary-grid">

          <div>
            <span>
              Safe Capacity
            </span>
            <strong>
              120kW
            </strong>
          </div>

          <div>
            <span>
              Peak Reduction
            </span>
            <strong>
              22.08%
            </strong>
          </div>

          <div>
            <span>
              Energy Shifted
            </span>
            <strong>
              244kWh
            </strong>
          </div>

          <div>
            <span>
              Estimated Saving
            </span>
            <strong>
              414.800₫
            </strong>
          </div>

        </div>
      </section>

      {/* MAIN GRID */}
      <div className="charging-main-grid">

        {/* LEFT */}
        <div className="charging-sessions-area">

          {/* TOOLBAR */}
          <section className="card charging-toolbar">

            <div className="charging-search-wrap">

              <Search size={18} />

              <input
                className="charging-search"
                placeholder="Search EV ID..."
                value={
                  searchInput
                }
                onChange={(e) =>
                  setSearchInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    handleSearch();
                  }
                }}
              />

              <button
                className="charging-search-btn"
                onClick={
                  handleSearch
                }
              >
                Search
              </button>
            </div>

            <div className="charging-toolbar-right">

              {[
                "all",
                "urgent",
                "normal",
                "flexible",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setFilter(
                      type
                    )
                  }
                  className={`charging-filter-btn ${
                    filter ===
                    type
                      ? "active"
                      : ""
                  }`}
                >
                  {type
                    .charAt(0)
                    .toUpperCase() +
                    type.slice(
                      1
                    )}
                </button>
              ))}
            </div>
          </section>

          {/* LIVE SESSION */}
          <section className="card live-session-card">

            <div className="section-header">
              <div>
                <h3>
                  Live Charging
                  Sessions
                </h3>

                <p>
                  {
                    filteredSessions.length
                  }{" "}
                  vehicles found
                </p>
              </div>
            </div>

            <div className="ev-session-grid">

              {filteredSessions.map(
                (
                  session
                ) => (
                  <div
                    key={
                      session.id
                    }
                    onClick={() =>
                      setSelectedVehicle(
                        session.id
                      )
                    }
                    style={{
                      cursor:
                        "pointer",
                    }}
                  >
                    <EVSessionCard
                      session={
                        session
                      }
                      isActive={
                        selectedVehicle ===
                        session.id
                      }
                    />
                  </div>
                )
              )}

            </div>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="charging-sidebar">

          <section className="card charging-summary-card">
            <VehicleLookup
              selectedVehicle={
                selectedVehicle
              }
            />
          </section>

        </aside>
      </div>
    </div>
  );
}