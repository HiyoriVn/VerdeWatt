import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function LandingDashboardPreview({
  peakReductionPercent = 28,
  evsServedLabel = "6 / 8",
  alertCount = 2,
  loading = false,
  chartData = [],
  apiOnline = false,
  onOpenDashboard,
}) {
  const hasChart = chartData.length > 0;
  const hasOptimizedLine = chartData.some((row) =>
    Number.isFinite(row.optimized_total_load_kw)
  );

  return (
    <div className="lp-dash-preview" aria-label="Dashboard preview">
      <div className="lp-dash-preview__chrome">
        <span className="lp-dash-preview__dot" />
        <span className="lp-dash-preview__dot" />
        <span className="lp-dash-preview__dot" />
        <span className="lp-dash-preview__title">VerdeWatt — Energy Control Center</span>
      </div>

      <div className="lp-dash-preview__kpis">
        <div className="lp-dash-preview__kpi">
          <span className="lp-dash-preview__kpi-label">Peak reduction</span>
          <strong>{loading ? "…" : `${peakReductionPercent}%`}</strong>
        </div>
        <div className="lp-dash-preview__kpi">
          <span className="lp-dash-preview__kpi-label">EVs served</span>
          <strong>{loading ? "…" : evsServedLabel}</strong>
        </div>
        <div className="lp-dash-preview__kpi lp-dash-preview__kpi--alert">
          <span className="lp-dash-preview__kpi-label">Active alerts</span>
          <strong>{loading ? "…" : alertCount}</strong>
        </div>
      </div>

      <div className="lp-dash-preview__chart">
        <div className="lp-dash-preview__chart-head">
          <span>{apiOnline ? "Building load" : "Building load overview"}</span>
        </div>

        {hasChart ? (
          <div className="lp-dash-preview__recharts">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
              >
                <CartesianGrid stroke="#e8efe0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickFormatter={(value) => `${value}h`}
                  stroke="#64715a"
                  fontSize={11}
                  interval={3}
                />
                <YAxis unit=" kW" stroke="#64715a" fontSize={11} width={42} />
                <Tooltip
                  labelFormatter={(value) => `Hour ${value}:00`}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #d4dcc7",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="unmanaged_total_load_kw"
                  name="Unmanaged"
                  stroke="#e07a5f"
                  strokeWidth={2}
                  dot={false}
                />
                {hasOptimizedLine ? (
                  <Line
                    type="monotone"
                    dataKey="optimized_total_load_kw"
                    name="Optimized"
                    stroke="#4a8c30"
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls
                  />
                ) : null}
                <Line
                  type="monotone"
                  dataKey="safe_capacity_kw"
                  name="Safe capacity"
                  stroke="#b44a2f"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="lp-dash-preview__empty">
            Load data unavailable — sign in when your building is connected.
          </p>
        )}
      </div>

      <div className="lp-dash-preview__footer">
        <span className="lp-dash-preview__status lp-dash-preview__status--ok">
          {apiOnline ? "Connected to your building" : "Sample preview"}
        </span>
        {onOpenDashboard ? (
          <button
            type="button"
            className="lp-dash-preview__link"
            onClick={onOpenDashboard}
          >
            Open dashboard &rarr;
          </button>
        ) : (
          <span className="lp-dash-preview__hint">Same charts on staff dashboard</span>
        )}
      </div>
    </div>
  );
}
