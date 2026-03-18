import { apiFetch } from "./apiFetch";

class PingApi {
  async fetchPing(): Promise<string> {
    return await apiFetch("/api/health")
      .then((r) => r.json())
      .catch(() => {
        throw new Error("Failed to fetch ping data");
      });
  }
}

export const pingApi = new PingApi();
