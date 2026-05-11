const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

/* =========================
   CORE REQUEST
========================= */

async function request(
  path,
  options = {}
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers || {}),
        },

        ...options,
      }
    );

    if (!response.ok) {
      let detail =
        "Unexpected API error";

      try {
        const errorBody =
          await response.json();

        detail =
          errorBody?.detail ||
          detail;
      } catch {
        // ignore json parse errors
      }

      throw new Error(detail);
    }

    return response.json();
  } catch (error) {
    console.error(
      `API ERROR (${path})`,
      error
    );

    throw error;
  }
}

/* =========================
   LOAD
========================= */

export function getLoad() {
  return request("/api/load");
}

/* =========================
   EV SESSIONS
========================= */

export function getSessions() {
  return request("/api/sessions");
}

/* =========================
   SMART ALLOCATION
========================= */

export function runAllocation() {
  return request("/api/allocate", {
    method: "POST",

    body: JSON.stringify({}),
  });
}

/* =========================
   ALERTS
========================= */

export function getAlerts() {
  return request("/api/alerts");
}

/* =========================
   BILLING
========================= */

export function getBilling() {
  return request("/api/billing", {
    method: "POST",

    body: JSON.stringify({}),
  });
}

/* =========================
   SCHEDULE
========================= */

export function getSchedule() {
  return request("/api/schedule");
}

/* =========================
   VEHICLE DETAILS
========================= */

export function getVehicle(
  vehicleId
) {
  return request(
    `/api/vehicle/${encodeURIComponent(
      vehicleId
    )}`
  );
}

/* =========================
   CHARGER COMMANDS
========================= */

export function getChargerCommands() {
  return request(
    "/api/charger-commands"
  );
}