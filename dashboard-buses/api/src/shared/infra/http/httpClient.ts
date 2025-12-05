export interface HttpClient {
  get<T = unknown>(url: string, options?: RequestInit): Promise<T>;
  post<T = unknown>(url: string, body: any, options?: RequestInit): Promise<T>;
}

export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, { ...options, method: 'GET' });
    if (!res.ok) throw new Error(`HTTP GET ${url} failed: ${res.status}`);
    return (await res.json()) as T;
  }

  async post<T>(url: string, body: any, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {})
      }
    });
    if (!res.ok) throw new Error(`HTTP POST ${url} failed: ${res.status}`);
    return (await res.json()) as T;
  }
}
