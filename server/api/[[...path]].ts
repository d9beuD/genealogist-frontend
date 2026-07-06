import type { H3Event } from "#imports";

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const symfonyBaseUrl = config.public.symfonyBaseUrl;

  if (!symfonyBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Symfony API URL not configured",
    });
  }

  const path = getRouterParam(event, "path") || "";

  const targetUrl = `${symfonyBaseUrl.replace(/\/$/, "")}/${path}`;

  const query = getQuery(event);

  const headers: Record<string, string> = {};

  const headerMap = [
    "content-type",
    "accept",
    "authorization",
    "cookie",
    "user-agent",
    "origin",
    "referer",
    "cache-control",
    "x-request-id",
  ];

  for (const header of headerMap) {
    const value = getHeader(event, header);
    if (value) {
      headers[header] = value;
    }
  }

  let body: string | Record<string, unknown> | null | undefined = undefined;
  const method = event.method;

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    body = await readBody(event);
  }

  try {
    const response = await $fetch.raw(targetUrl, {
      method,
      headers,
      body,
      query,
      redirect: "manual",
    });

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const cookies = splitCookiesString(setCookieHeader).map((cookie: string) =>
        cookie.replace(/;\s*Domain=[^;]+/gi, "")
      );

      for (const cookie of cookies) {
        appendResponseHeader(event, "set-cookie", cookie);
      }
    }

    for (const [key, value] of response.headers.entries()) {
      const header = key.toLowerCase();

      if (header === "set-cookie" || hopByHopHeaders.has(header)) {
        continue;
      }

      appendResponseHeader(event, key, value);
    }

    setResponseStatus(event, response.status, response.statusText);

    return response._data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      const err = error as { statusCode?: number; statusMessage?: string; data?: unknown };

      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.statusMessage || "Symfony API Error",
        data: err.data,
      });
    }

    const message = error instanceof Error ? error.message : "Unknown error";

    throw createError({
      statusCode: 502,
      statusMessage: "Bad Gateway - Symfony API unreachable",
      data: { message },
    });
  }
});
