class PingApi {
  async fetchPing(): Promise<string> {
    return await fetch(process.env.API_URL + "/ping")
      .then((r) => r.json())
      .catch(() => {
        throw new Error("Failed to fetch ping data");
      });
  }
}

export const pingApi = new PingApi();
