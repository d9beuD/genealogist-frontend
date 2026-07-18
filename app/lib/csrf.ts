const csrfCookieHeaders = [
  { cookieName: "XSRF-TOKEN", headerName: "x-xsrf-token" },
  { cookieName: "csrf-token", headerName: "x-csrf-token" },
  { cookieName: "csrf_token", headerName: "x-csrf-token" },
  { cookieName: "CSRF-TOKEN", headerName: "x-csrf-token" },
] as const;

export function getUnsafeRequestCsrfHeaders():
  | Record<string, string>
  | undefined {
  if (!import.meta.client) {
    return undefined;
  }

  const headers: Record<string, string> = {};

  for (const { cookieName, headerName } of csrfCookieHeaders) {
    if (headers[headerName]) {
      continue;
    }

    const token = readCookie(cookieName);
    if (token) {
      headers[headerName] = token;
    }
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
}

function readCookie(name: string): string | undefined {
  for (const cookie of document.cookie.split(";")) {
    const trimmedCookie = cookie.trim();
    const separatorIndex = trimmedCookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const cookieName = trimmedCookie.slice(0, separatorIndex);
    if (cookieName !== name) {
      continue;
    }

    const cookieValue = trimmedCookie.slice(separatorIndex + 1);
    try {
      return decodeURIComponent(cookieValue);
    } catch {
      return cookieValue;
    }
  }

  return undefined;
}
