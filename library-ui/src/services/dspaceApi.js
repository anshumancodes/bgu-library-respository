export default class DSpaceApi {
  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  async healthCheck() {
    try {
      const res = await fetch(`${this.baseUrl}/status`);
      if (!res.ok) {
        throw new Error(`Health check failed: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("Health check error:", err);
      return null;
    }
  }

  async getCommunities(page = 0, size = 10) {
    try {
      const res = await fetch(
        `${this.baseUrl}/core/communities?page=${page}&size=${size}`
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch communities: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("Get communities error:", err);
      return { page: { totalElements: 0 }, _embedded: { communities: [] } };
    }
  }
}
