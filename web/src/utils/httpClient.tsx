export interface HttpClientConfig {
  baseURL?: string;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
}

export interface RequestOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorApiResponse extends ApiResponse<null> {
  success: false;
  message: string;
  code?: string;
}

class HttpClient {
  private readonly defaultHeaders: HeadersInit;
  private readonly credentials: RequestCredentials;
  private isRefreshing = false;

  constructor(config: HttpClientConfig = {}) {
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };
    this.credentials = config.credentials || "include";
  }

  private async request<T>(
    endpoint: string,
    method: string,
    body?: unknown,
    options?: RequestOptions,
    retryCount: number = 0
  ): Promise<T> {
    const requestInit: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      credentials: this.credentials,
      signal: options?.signal,
    };

    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(endpoint, requestInit);
      if (response.status === 401 && retryCount < 1) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          try {
            this.isRefreshing = false;

            return await this.request<T>(
              endpoint,
              method,
              body,
              options,
              retryCount + 1
            );
          } catch (error) {
            this.isRefreshing = false;
            throw error;
          }
        }
      }
      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = (await response.json()) satisfies ErrorApiResponse;
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Ignore
        }
        throw new Error(errorMessage);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = (await response.json()) as ApiResponse<T>;
        if (!data.success) {
          throw new Error(data.message || "API Error");
        }
        return data.data satisfies T;
      }

      return (await response.text()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "GET", undefined, options);
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", body, options);
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", body, options);
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, "PATCH", body, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
}

export const httpClient = new HttpClient();

export default HttpClient;