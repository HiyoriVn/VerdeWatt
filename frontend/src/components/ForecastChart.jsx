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

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ForecastChart({
  forecast,
  loadData = [],
}) {
  const predictions = Array.isArray(
    forecast?.predictions
  )
    ? forecast.predictions
    : [];

  const chartData = predictions.map((item) => ({
    hour: item.hour,
    predicted_base_load_kw: toNumber(
      item.predicted_base_load_kw
    ),
  }));

  const featureImportance = Array.isArray(
    forecast?.feature_importance
  )
    ? [...forecast.feature_importance]
        .sort(
          (a, b) =>
            toNumber(b?.importance) -
            toNumber(a?.importance)
        )
        .slice(0, 3)
    : [];

  if (!chartData.length && !loadData.length) {
    return (
      <>
        <h3>Forecast Trend</h3>
        <p className="muted-text">
          Forecast data is not available yet.
        </p>
      </>
    );
  }

  const fallbackData = loadData.map((row) => ({
    hour: row.hour,
    predicted_base_load_kw: toNumber(
      row.base_load_kw
    ),
  }));

  const dataToRender = chartData.length
    ? chartData
    : fallbackData;
  const modelName =
    forecast?.model || "Forecast API unavailable";

  return (
    <>
      <h3>Forecast Trend</h3>
      <p className="muted-text">
        Model: {modelName}
      </p>

      {!chartData.length && (
        <p className="muted-text">
          Showing base load fallback while
          backend forecast is unavailable.
        </p>
      )}

      {featureImportance.length > 0 && (
        <p className="muted-text">
          Top features:{" "}
          {featureImportance
            .map(
              (item) =>
                `${item.feature} (${toNumber(
                  item.importance
                ).toFixed(4)})`
            )
            .join(", ")}
        </p>
      )}

      <div className="forecast-chart-wrap">
        <ResponsiveContainer>
          <LineChart
            data={dataToRender}
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
              dataKey="predicted_base_load_kw"
              name="Predicted Base Load"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default ForecastChart;
