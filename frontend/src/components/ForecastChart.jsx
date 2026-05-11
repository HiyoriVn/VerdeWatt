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

function weightedMovingAverage(values, index) {
  const current = Number(values[index] ?? 0);
  const prev1 = Number(values[index - 1] ?? current);
  const prev2 = Number(values[index - 2] ?? prev1);

  return (
    prev2 * 0.2 + prev1 * 0.3 + current * 0.5
  );
}

function ForecastChart({ loadData = [] }) {
  if (!loadData.length) {
    return (
      <>
        <h3>Forecast Chart</h3>
        <p className="muted-text">
          Forecast data is not available yet.
        </p>
      </>
    );
  }

  const unmanagedSeries = loadData.map((row) =>
    Number(row.base_load_kw ?? 0) +
    Number(row.unmanaged_ev_load_kw ?? 0)
  );

  const forecastData = loadData.map((row, index) => ({
    hour: row.hour,
    unmanaged_total_load_kw: unmanagedSeries[index],
    forecast_total_load_kw: weightedMovingAverage(
      unmanagedSeries,
      index
    ),
    safe_capacity_kw: Number(
      row.safe_capacity_kw ?? 0
    ),
  }));

  return (
    <>
      <h3>Forecast Trend</h3>
      <p className="muted-text">
        Weighted moving average forecast for
        unmanaged total load.
      </p>

      <div className="forecast-chart-wrap">
        <ResponsiveContainer>
          <LineChart
            data={forecastData}
            margin={{
              top: 10,
              right: 18,
              left: 2,
              bottom: 6,
            }}
          >
            <CartesianGrid
              stroke="var(--chart-grid)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="hour"
              tickFormatter={(value) => `${value}:00`}
              stroke="var(--text-soft)"
            />

            <YAxis
              unit=" kW"
              stroke="var(--text-soft)"
            />

            <Tooltip
              labelFormatter={(value) =>
                `Hour ${value}:00`
              }
              contentStyle={{
                background: "var(--tooltip-bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                color: "var(--text)",
              }}
            />

            <Legend wrapperStyle={{ color: "var(--text-soft)" }} />

            <Line
              type="monotone"
              dataKey="unmanaged_total_load_kw"
              name="Unmanaged Total"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="forecast_total_load_kw"
              name="Forecast Total"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="safe_capacity_kw"
              name="Safe Capacity"
              stroke="#22c55e"
              strokeDasharray="6 4"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default ForecastChart;
