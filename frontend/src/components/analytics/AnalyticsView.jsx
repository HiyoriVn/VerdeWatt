import {
  Activity,
  ShieldCheck,
  TrendingUp,
  Leaf,
} from "lucide-react";

import ForecastChart from "./ForecastChart";
import ImpactCards from "./ImpactCards";

export default function AnalyticsView() {
  /* MOCK DATA */

  const loadData = [
    {
      hour: 0,
      base_load_kw: 160,
      unmanaged_ev_load_kw: 25,
      safe_capacity_kw: 260,
    },
    {
      hour: 3,
      base_load_kw: 150,
      unmanaged_ev_load_kw: 35,
      safe_capacity_kw: 260,
    },
    {
      hour: 6,
      base_load_kw: 180,
      unmanaged_ev_load_kw: 60,
      safe_capacity_kw: 260,
    },
    {
      hour: 9,
      base_load_kw: 210,
      unmanaged_ev_load_kw: 80,
      safe_capacity_kw: 260,
    },
    {
      hour: 12,
      base_load_kw: 260,
      unmanaged_ev_load_kw: 100,
      safe_capacity_kw: 260,
    },
    {
      hour: 15,
      base_load_kw: 280,
      unmanaged_ev_load_kw: 120,
      safe_capacity_kw: 260,
    },
    {
      hour: 18,
      base_load_kw: 320,
      unmanaged_ev_load_kw: 160,
      safe_capacity_kw: 260,
    },
    {
      hour: 21,
      base_load_kw: 250,
      unmanaged_ev_load_kw: 110,
      safe_capacity_kw: 260,
    },
  ];

  const billing = {
    shifted_kwh: 244,
    total_kwh: 980,
    offpeak_kwh: 615,
    estimated_saving_vnd: 414800,
  };

  const allocation = {
    peak_reduction_percent: 22.08,
  };

  return (
    <div className="analytics-view">

      {/* HERO */}
      <section className="analytics-hero">

        <div>
          <div className="analytics-hero-badge">
            ⚡ AI Energy Intelligence
          </div>

          <h1>
            Energy Intelligence
            Center
          </h1>

          <p>
            Forecast EV demand,
            optimize sustainability
            and monitor building
            energy performance in
            real time.
          </p>
        </div>

        <div className="analytics-hero-stats">

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <Activity size={22} />
            </div>

            <div>
              <strong>94%</strong>
              <span>
                Forecast Accuracy
              </span>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <TrendingUp
                size={22}
              />
            </div>

            <div>
              <strong>22%</strong>
              <span>
                Peak Reduction
              </span>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <Leaf size={22} />
            </div>

            <div>
              <strong>128kg</strong>
              <span>
                CO₂ Saved
              </span>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <ShieldCheck
                size={22}
              />
            </div>

            <div>
              <strong>
                Healthy
              </strong>
              <span>
                Grid Status
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="analytics-impact-card">
        <ImpactCards
          billing={billing}
          allocation={
            allocation
          }
        />
      </section>

      {/* GRID */}
      <div className="analytics-main-grid">

        <section className="analytics-chart-card">
          <ForecastChart
            loadData={loadData}
          />
        </section>

        <aside className="analytics-sidebar">

          <section className="analytics-side-card">
            <h3>
              Optimization
              Insights
            </h3>

            <div className="analytics-insight-list">

              <div className="analytics-insight-item">
                <strong>
                  Peak Demand
                </strong>

                <p>
                  Energy demand is
                  expected to peak
                  between 18:00 and
                  21:00.
                </p>
              </div>

              <div className="analytics-insight-item">
                <strong>
                  Recommendation
                </strong>

                <p>
                  Shift flexible EV
                  sessions to late
                  evening charging.
                </p>
              </div>

              <div className="analytics-insight-item">
                <strong>
                  Potential Saving
                </strong>

                <p>
                  Estimated
                  additional
                  saving:
                  <strong>
                    {" "}
                    32.4 kWh
                  </strong>
                </p>
              </div>

            </div>
          </section>

          <section className="analytics-side-card">
            <h3>
              System Health
            </h3>

            <div className="analytics-health-list">

              <div className="health-item">
                <span>
                  Grid Stability
                </span>
                <strong>
                  Healthy
                </strong>
              </div>

              <div className="health-item">
                <span>
                  Charging Risk
                </span>
                <strong>
                  Low
                </strong>
              </div>

              <div className="health-item">
                <span>
                  Forecast
                  Confidence
                </span>
                <strong>
                  94%
                </strong>
              </div>

            </div>
          </section>

        </aside>
      </div>
    </div>
  );
}