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
    return <p>No load data available yet.</p>;
  }

  const chartData = data.map((row) => ({
    ...row,
    unmanaged_total_load_kw: Number(row.base_load_kw || 0) + Number(row.unmanaged_ev_load_kw || 0),
  }));

  return (
    <div>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} />
            <YAxis unit=" kW" />
            <Tooltip labelFormatter={(value) => `Hour ${value}:00`} />
            <Legend />
            <Line type="monotone" dataKey="base_load_kw" name="Base Load" stroke="#1f77b4" dot={false} />
            <Line
              type="monotone"
              dataKey="safe_capacity_kw"
              name="Safe Capacity"
              stroke="#2ca02c"
              strokeDasharray="5 4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="unmanaged_ev_load_kw"
              name="Unmanaged EV Load"
              stroke="#d62728"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="unmanaged_total_load_kw"
              name="Unmanaged Total Load"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p
        style={{
          margin: "10px 2px 0 2px",
          fontSize: 13,
          color: "#4b5563",
          lineHeight: 1.45,
        }}
      >
        During evening peak hours, unmanaged total load can rise above the safe capacity line.
        This is the overload risk that smart allocation is designed to reduce.
      </p>
    </div>
  );
}

export default LoadCurveChart;
