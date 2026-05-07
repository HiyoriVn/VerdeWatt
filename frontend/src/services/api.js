const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function getLoad() {
  return request("/api/load");
}

export function getSessions() {
  return request("/api/sessions");
}

export function runAllocation() {
  return request("/api/allocate", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function getAlerts() {
  return request("/api/alerts");
}

export function getBilling() {
  return request("/api/billing", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
