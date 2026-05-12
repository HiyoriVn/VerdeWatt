import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";
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

function buildOptimizedLoadMap(
  allocationData,
  referenceRows
) {
  const map = new Map();

  if (!Array.isArray(allocationData)) {
    return map;
  }

  allocationData.forEach((entry, index) => {
    if (
      entry !== null &&
      typeof entry === "object"
    ) {
      const hourValue =
        entry.hour ?? entry.time ?? index;

      const optimizedValue = [
        entry.optimized_total_load_kw,
        entry.total_load_kw,
        entry.total_kw,
        entry.load_kw,
        entry.value,
      ].find((value) => value !== undefined);

      map.set(
        String(hourValue),
        Number(optimizedValue ?? 0)
      );

      return;
    }

    const fallbackHour =
      referenceRows[index]?.hour ?? index;

    map.set(String(fallbackHour), Number(entry ?? 0));
  });

  return map;
}

function LoadCurveChart({
  data = [],
  allocationData,
}) {
  if (!data.length) {
    return (
      <section className="card glass-card">
        <p className="muted-text">
          No load data available yet.
        </p>
      </section>
    );
  }

  const optimizedLoadMap = buildOptimizedLoadMap(
    allocationData,
    data
  );

  const chartData = data.map((row) => {
    const baseLoad = Number(row.base_load_kw ?? 0);
    const unmanagedEv = Number(
      row.unmanaged_ev_load_kw ?? 0
    );

    const hourKey = String(row.hour);

    return {
      ...row,
      unmanaged_total_load_kw:
        baseLoad + unmanagedEv,
      optimized_total_load_kw:
        optimizedLoadMap.has(hourKey)
          ? optimizedLoadMap.get(hourKey)
          : null,
    };
  });

  const hasOptimizedLine = chartData.some((row) =>
    Number.isFinite(row.optimized_total_load_kw)
  );

  return (
    <section className="card glass-card">
      <div className="load-curve-header">
        <h2>Load Curve Analytics</h2>

        <button
          type="button"
          className="chart-date-button"
        >
          <CalendarDays size={14} />
          <span>Today</span>
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="load-curve-chart-frame">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 12,
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
              dataKey="base_load_kw"
              name="Base Load"
              stroke="#2563eb"
              strokeWidth={2}
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

            <Line
              type="monotone"
              dataKey="unmanaged_ev_load_kw"
              name="Unmanaged EV Load"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="unmanaged_total_load_kw"
              name="Unmanaged Total Load"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={false}
            />

            {hasOptimizedLine ? (
              <Line
                type="monotone"
                dataKey="optimized_total_load_kw"
                name="Optimized Total Load"
                stroke="#f97316"
                strokeWidth={3}
                dot={false}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="muted-text load-chart-note">
        During evening peak hours, unmanaged total
        load can rise above the safe capacity line.
        This is the overload risk smart allocation
        is designed to reduce.
      </p>
    </section>
  );
}

export default LoadCurveChart;
