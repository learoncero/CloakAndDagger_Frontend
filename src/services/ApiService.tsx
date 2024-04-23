export default class ApiService {
  static async fetch(baseUrl: string, pathname: string, init?: RequestInit) {
    let status, statusText, data;

    try {
      const url = new URL(pathname, baseUrl);
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

  static post(baseUrl: string, pathname: string, body?: any) {
    return ApiService.fetch(baseUrl, pathname, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static get(baseUrl: string, pathname: string) {
    return ApiService.fetch(baseUrl, pathname, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
