import { apiFetch } from "./apiFetch";

export interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
}

class PingApi {
  async fetchHealth(): Promise<HealthData> {
    const res = await apiFetch("/api/health");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
}

export const pingApi = new PingApi();
