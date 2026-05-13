/* frontend/src/components/dashboard/AllocationSummary.jsx */

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  CircleAlert,
  CircleCheck,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

function toFiniteNumber(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? numericValue
    : fallback;
}

function formatValue(
  value,
  maximumFractionDigits = 1
) {
  return toFiniteNumber(value).toLocaleString(
    undefined,
    {
      maximumFractionDigits,
    }
  );
}

function formatSignedValue(
  value,
  maximumFractionDigits = 1
) {
  const safeValue = toFiniteNumber(value);

  if (safeValue > 0) {
    return `+${safeValue.toLocaleString(undefined, {
      maximumFractionDigits,
    })}`;
  }

  return safeValue.toLocaleString(undefined, {
    maximumFractionDigits,
  });
}

function AllocationSummary({
  allocation,
}) {
  if (!allocation) {
    return (
      <section className="smart-allocation-summary smart-allocation-summary-empty">
        <div className="summary-header">
          <h3>Smart Allocation Summary</h3>
          <p>
            Run allocation to view peak reduction,
            safety margin, and EV service coverage.
          </p>
        </div>
      </section>
    );
  }

  const peakBefore = toFiniteNumber(
    allocation.peak_before_kw
  );

  const peakAfter = toFiniteNumber(
    allocation.peak_after_kw
  );

  const reductionPercent = toFiniteNumber(
    allocation.peak_reduction_percent
  );

  const safetyMargin = toFiniteNumber(
    allocation.peak_after_under_safe_capacity_kw
  );

  const evFullyServed = Array.isArray(
    allocation.evs_fully_served
  )
    ? allocation.evs_fully_served.length
    : 0;

  const evPartiallyServed = Array.isArray(
    allocation.evs_partially_served
  )
    ? allocation.evs_partially_served.length
    : 0;
  const evTotalServed =
    evFullyServed + evPartiallyServed;
  const isSafe = safetyMargin >= 0;

  const normalizedReductionPercent = Math.max(
    Math.min(Math.abs(reductionPercent), 100),
    0
  );

  const donutData = [
    {
      name: "Peak Reduced",
      value: normalizedReductionPercent,
    },
    {
      name: "Remaining Peak",
      value:
        100 - normalizedReductionPercent,
    },
  ];

  const metricItems = [
    {
      label: "Peak Before",
      value: `${formatValue(peakBefore, 0)} kW`,
      Icon: TrendingUp,
      tone: "before",
    },
    {
      label: "Peak After",
      value: `${formatValue(peakAfter, 0)} kW`,
      Icon: TrendingDown,
      tone: "after",
    },
    {
      label: "Peak Reduction",
      value: `${formatValue(
        reductionPercent,
        1
      )}%`,
      Icon: CircleCheck,
      tone:
        reductionPercent >= 0
          ? "reduction"
          : "risk",
    },
    {
      label: `Safety Margin ${
        safetyMargin >= 0
          ? "(Safe)"
          : "(Risk)"
      }`,
      value: `${formatSignedValue(
        safetyMargin
      )} kW`,
      Icon:
        safetyMargin >= 0
          ? Shield
          : CircleAlert,
      tone:
        safetyMargin >= 0
          ? "safe"
          : "risk",
    },
  ];

  return (
    <section className="smart-allocation-summary">
      <div className="summary-header">
        <div>
          <h3>Smart Allocation Summary</h3>

          <p>
            Peak control performance and safety
            margin at a glance.
          </p>
        </div>

        <span
          className={`summary-safety-pill ${
            isSafe ? "safe" : "risk"
          }`}
        >
          {isSafe
            ? "Within Capacity"
            : "Over Capacity"}
        </span>
      </div>

      <div className="summary-layout summary-layout-reference">
        <div className="summary-metric-list">
          {metricItems.map((metric) => {
            const Icon = metric.Icon;

            return (
              <article
                key={metric.label}
                className={`summary-metric-row summary-metric-row-${metric.tone}`}
              >
                <div className="summary-metric-main">
                  <span className="summary-metric-icon">
                    <Icon size={14} />
                  </span>

                  <span className="summary-metric-label">
                    {metric.label}
                  </span>
                </div>

                <strong>
                  {metric.value}
                </strong>
              </article>
            );
          })}
        </div>

        <div className="summary-chart-column">
          <div className="summary-chart-wrap">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius={64}
                  outerRadius={86}
                  paddingAngle={2}
                  stroke="none"
                >
                  <Cell fill="#1FBB77" />
                  <Cell fill="#D6EEE7" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="summary-chart-center">
              <strong>
                {formatValue(
                  normalizedReductionPercent,
                  1
                )}
                %
              </strong>

              <span>Peak Reduction</span>
            </div>
          </div>

          <div className="summary-chart-caption">
            <span>
              Fully served: {evFullyServed}
            </span>
            <span>
              Partial: {evPartiallyServed}
            </span>
            <span>
              Total EVs: {evTotalServed}
            </span>
          </div>
        </div>
      </div>

      <p className="summary-footnote">
        Priority-first allocation keeps urgent EVs
        charged first while reducing overload risk.
      </p>
    </section>
  );
}
export default AllocationSummary;
