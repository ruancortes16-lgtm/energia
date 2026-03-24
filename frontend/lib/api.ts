import { Alert, DashboardOverview, Limits, LimitsPayload, Reading, ReadingPayload } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Falha na requisicao para ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function getDashboardOverview() {
  return request<DashboardOverview>("/dashboard/overview");
}

export async function getReadings(limit = 120) {
  return request<Reading[]>(`/readings/history?limit=${limit}`);
}

export async function createReading(payload: ReadingPayload) {
  return request<Reading>("/readings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getAlerts(limit = 8) {
  return request<Alert[]>(`/alerts?limit=${limit}`);
}

export async function getLimits() {
  return request<Limits>("/settings/limits");
}

export async function updateLimits(payload: LimitsPayload) {
  return request<Limits>("/settings/limits", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
