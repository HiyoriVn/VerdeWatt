const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getLoad: () => request("/api/load"),

  getSessions: () => request("/api/sessions"),

  runAllocation: () =>
    request("/api/allocate", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  getBilling: () =>
    request("/api/billing", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  getAlerts: () => request("/api/alerts"),
};