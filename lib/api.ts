// API client — fetch wrapper with Clerk token injection
import { API_URL } from "./constants";

let getTokenFn: (() => Promise<string | null>) | null = null;

/**
 * Set the token getter function (called from auth setup)
 */
export function setTokenGetter(fn: () => Promise<string | null>) {
  getTokenFn = fn;
}

/**
 * Make an authenticated API request
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach auth token if available
  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API Error ${response.status}: ${errorBody || response.statusText}`
    );
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
