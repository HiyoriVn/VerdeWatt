import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function LoadCurveChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="dashboard-card">
        <p>No load data available yet.</p>
      </div>
    );
  }

  const chartData = data.map((row) => ({
    ...row,

    unmanaged_total_load_kw:
      Number(row.base_load_kw || 0) +
      Number(row.unmanaged_ev_load_kw || 0),
  }));

  return (
    <div className="dashboard-card">
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
        }}
      >
        Load Curve Analytics
      </h2>

      <div
        style={{
          width: "100%",
          height: 340,
        }}
      >
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 16,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid
              stroke="rgba(148,163,184,0.15)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="hour"
              tickFormatter={(value) => `${value}:00`}
              stroke="var(--text-soft)"
              tick={{
                fill: "var(--text-soft)",
              }}
            />

            <YAxis
              unit=" kW"
              stroke="var(--text-soft)"
              tick={{
                fill: "var(--text-soft)",
              }}
            />

            <Tooltip
              labelFormatter={(value) => `Hour ${value}:00`}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "14px",

                color: "var(--text)",

                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.25)",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="base_load_kw"
              name="Base Load"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="safe_capacity_kw"
              name="Safe Capacity"
              stroke="#22c55e"
              strokeDasharray="5 4"
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
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p
        style={{
          marginTop: 18,

          fontSize: 13,

          color: "var(--text-soft)",

          lineHeight: 1.6,
        }}
      >
        During evening peak hours, unmanaged total
        load can rise above the safe capacity line.
        This is the overload risk that smart
        allocation is designed to reduce.
      </p>
    </div>
  );
}

export default LoadCurveChart;