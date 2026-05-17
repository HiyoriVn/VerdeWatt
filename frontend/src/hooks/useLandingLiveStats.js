import { useEffect, useMemo, useState } from "react";

import {
  getAlerts,
  getHealth,
  getImpact,
  getLoad,
  getSessions,
  runAllocation,
} from "../services/api";

const DEFAULT_IMPACT = {
  shifted_kwh: null,
  co2_saved_kg: null,
  estimated_saving_vnd: null,
};

const DEFAULT_ALLOCATION = {
  peak_reduction_percent: null,
  peak_before_kw: null,
  peak_after_kw: null,
  peak_reduction_kw: null,
  peak_after_is_safe: null,
  evs_fully_served: [],
  evs_partially_served: [],
  total_load_after_optimization: [],
};

const DEFAULT_LOAD_ROWS = [];

function formatMetricValue(value, unit) {
  if (value == null || Number.isNaN(value)) {
    return "—";
  }

  if (unit === "vnd") {
    return `${Math.round(value).toLocaleString("vi-VN")} VND`;
  }

  if (unit === "kwh") {
    return `${Number(value).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })} kWh`;
  }

  if (unit === "kg") {
    return `${Number(value).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })} kg`;
  }

  return String(value);
}

function buildChartData(loadRows, allocation) {
  if (!loadRows.length) {
    return [];
  }

  const optimizedMap = new Map();
  (allocation.total_load_after_optimization || []).forEach((row) => {
    optimizedMap.set(String(row.hour), Number(row.total_load_kw ?? 0));
  });

  return loadRows.map((row) => {
    const baseLoad = Number(row.base_load_kw ?? 0);
    const unmanagedEv = Number(row.unmanaged_ev_load_kw ?? 0);

    return {
      hour: row.hour,
      base_load_kw: baseLoad,
      unmanaged_total_load_kw: baseLoad + unmanagedEv,
      optimized_total_load_kw: optimizedMap.has(String(row.hour))
        ? optimizedMap.get(String(row.hour))
        : null,
      safe_capacity_kw: Number(row.safe_capacity_kw ?? 0),
    };
  });
}

function computeHeroStats(loadRows, allocation) {
  const fallback = {
    currentLoadKw: 472,
    safeCapacityKw: 490,
    capacityPercent: 96,
    ringOffset: 8,
    sessionCount: 18,
    sessionsDelta: 3,
  };

  if (!loadRows.length) {
    return fallback;
  }

  let peakUnmanaged = 0;
  let peakHour = loadRows[0].hour;
  let safeAtPeak = Number(loadRows[0].safe_capacity_kw ?? 490);

  loadRows.forEach((row) => {
    const unmanagedTotal =
      Number(row.base_load_kw ?? 0) + Number(row.unmanaged_ev_load_kw ?? 0);

    if (unmanagedTotal >= peakUnmanaged) {
      peakUnmanaged = unmanagedTotal;
      peakHour = row.hour;
      safeAtPeak = Number(row.safe_capacity_kw ?? safeAtPeak);
    }
  });

  const optimizedMap = new Map();
  (allocation.total_load_after_optimization || []).forEach((row) => {
    optimizedMap.set(String(row.hour), Number(row.total_load_kw ?? 0));
  });

  const optimizedAtPeak = optimizedMap.get(String(peakHour));
  const currentLoadKw = Math.round(
    Number(allocation.peak_after_kw ?? optimizedAtPeak ?? peakUnmanaged)
  );
  const safeCapacityKw = Math.round(safeAtPeak);
  const capacityPercent =
    safeCapacityKw > 0
      ? Math.min(100, Math.round((currentLoadKw / safeCapacityKw) * 100))
      : 0;
  const ringCircumference = 201;
  const ringOffset = Math.max(
    0,
    ringCircumference - (capacityPercent / 100) * ringCircumference
  );

  return {
    currentLoadKw,
    safeCapacityKw,
    capacityPercent,
    ringOffset,
    sessionCount: fallback.sessionCount,
    sessionsDelta: fallback.sessionsDelta,
    peakHour,
    peakUnmanagedKw: Math.round(peakUnmanaged),
  };
}

export function useLandingLiveStats() {
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);
  const [impact, setImpact] = useState(DEFAULT_IMPACT);
  const [allocation, setAllocation] = useState(DEFAULT_ALLOCATION);
  const [loadRows, setLoadRows] = useState(DEFAULT_LOAD_ROWS);
  const [alertCount, setAlertCount] = useState(2);
  const [sessionCount, setSessionCount] = useState(8);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);

      const results = await Promise.allSettled([
        getHealth(),
        getImpact(),
        runAllocation(),
        getAlerts(),
        getLoad(),
        getSessions(),
      ]);

      if (cancelled) {
        return;
      }

      const [
        healthResult,
        impactResult,
        allocationResult,
        alertsResult,
        loadResult,
        sessionsResult,
      ] = results;

      setApiOnline(healthResult.status === "fulfilled");

      if (impactResult.status === "fulfilled" && impactResult.value) {
        setImpact({
          shifted_kwh:
            impactResult.value.shifted_kwh ?? DEFAULT_IMPACT.shifted_kwh,
          co2_saved_kg:
            impactResult.value.co2_saved_kg ?? DEFAULT_IMPACT.co2_saved_kg,
          estimated_saving_vnd:
            impactResult.value.estimated_saving_vnd ??
            DEFAULT_IMPACT.estimated_saving_vnd,
        });
      }

      if (allocationResult.status === "fulfilled" && allocationResult.value) {
        const value = allocationResult.value;
        setAllocation({
          peak_reduction_percent:
            value.peak_reduction_percent ??
            DEFAULT_ALLOCATION.peak_reduction_percent,
          peak_before_kw: value.peak_before_kw ?? DEFAULT_ALLOCATION.peak_before_kw,
          peak_after_kw: value.peak_after_kw ?? DEFAULT_ALLOCATION.peak_after_kw,
          peak_reduction_kw:
            value.peak_reduction_kw ?? DEFAULT_ALLOCATION.peak_reduction_kw,
          peak_after_is_safe:
            value.peak_after_is_safe ?? DEFAULT_ALLOCATION.peak_after_is_safe,
          evs_fully_served:
            value.evs_fully_served ?? DEFAULT_ALLOCATION.evs_fully_served,
          evs_partially_served:
            value.evs_partially_served ?? DEFAULT_ALLOCATION.evs_partially_served,
          total_load_after_optimization:
            value.total_load_after_optimization ??
            DEFAULT_ALLOCATION.total_load_after_optimization,
        });
      }

      if (alertsResult.status === "fulfilled") {
        const alerts = alertsResult.value;
        setAlertCount(Array.isArray(alerts) ? alerts.length : 2);
      }

      if (loadResult.status === "fulfilled" && Array.isArray(loadResult.value)) {
        setLoadRows(loadResult.value);
      }

      if (sessionsResult.status === "fulfilled") {
        const sessions = sessionsResult.value;
        setSessionCount(Array.isArray(sessions) ? sessions.length : 8);
      }

      setLoading(false);
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo(
    () => buildChartData(loadRows, allocation),
    [loadRows, allocation]
  );

  const heroStats = useMemo(() => {
    const base = computeHeroStats(loadRows, allocation);
    return {
      ...base,
      sessionCount: sessionCount || base.sessionCount,
    };
  }, [loadRows, allocation, sessionCount]);

  const servedCount =
    (allocation.evs_fully_served?.length ?? 0) +
    (allocation.evs_partially_served?.length ?? 0);
  const fullyServed = allocation.evs_fully_served?.length ?? 0;

  const impactMetrics = [
    {
      label: "Shifted energy",
      value: formatMetricValue(impact.shifted_kwh, "kwh"),
    },
    {
      label: "CO2 avoided",
      value: formatMetricValue(impact.co2_saved_kg, "kg"),
    },
    {
      label: "Estimated savings",
      value: formatMetricValue(impact.estimated_saving_vnd, "vnd"),
    },
  ];

  const peakReductionPercent = Math.round(
    allocation.peak_reduction_percent ?? 28
  );

  return {
    loading,
    apiOnline,
    impactMetrics,
    chartData,
    heroStats,
    peakReductionPercent,
    peakBeforeKw: Math.round(allocation.peak_before_kw ?? 512),
    peakAfterKw: Math.round(allocation.peak_after_kw ?? 368),
    peakReductionKw: Math.round(allocation.peak_reduction_kw ?? 144),
    peakAfterIsSafe: allocation.peak_after_is_safe !== false,
    evsServedLabel: `${fullyServed} / ${servedCount || 8}`,
    alertCount,
  };
}
