const API_URL = "http://localhost:5010";

export default class ApiService {
  static async fetch(pathname: string, init?: RequestInit) {
    let status, statusText, data;

    try {
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

  static post(pathname: string, body?: any) {
    return ApiService.fetch(pathname, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static get(pathname: string) {
    return ApiService.fetch(pathname, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
