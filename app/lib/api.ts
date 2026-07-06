/**
 * Make an authenticated API call through the proxy
 * Automatically includes cookies for authentication
 */
export async function apiFetch<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: Record<string, unknown> | null;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  return $fetch<T>(`/api${path}`, {
    ...options,
  });
}

/**
 * Make a public API call (no auth required)
 */
export async function publicApiFetch<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: Record<string, unknown> | null;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  return apiFetch<T>(path, options);
}
