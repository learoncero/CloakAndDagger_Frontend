const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

  static get(baseUrl: string, pathname: string) {
    return ApiService.fetch(baseUrl, pathname, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static getBackendUrl(microservice: string) {
    const backendUrls: { [key: string]: string } = {
      game: `${apiUrl}:5010`,
      chat: `${apiUrl}:5011`,
      minigame: `${apiUrl}:5022`,
    };

    return backendUrls[microservice];
  }
}
