export default class ApiService {
  static async fetch(
    microservice: string,
    pathname: string,
    init?: RequestInit
  ) {
    let status, statusText, data;

    try {
      const API_URL = this.getBackendUrl(microservice);
      const url = new URL(pathname, API_URL);
      const response = await fetch(url, init);
      // Any response from API (e.g. 200, 404, …)
      status = response.status;
      statusText = response.statusText;
      data = await response.json().catch(() => undefined);
    } catch (error: any) {
      // No response from API
      statusText = error.message;
    }

    return { status, statusText, data };
  }

  static post(microservice: string, pathname: string, body?: any) {
    return ApiService.fetch(microservice, pathname, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static getBackendUrl(microservice: string) {
    // Define backend URLs based on microservice
    const backendUrls: { [key: string]: string } = {
      game: "http://localhost:5010",
      chat: "http://localhost:5011",
    };

    return backendUrls[microservice];
  }
}
