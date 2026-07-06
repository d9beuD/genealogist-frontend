export default defineEventHandler(async (event: any) => {
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

  let body: any = undefined;
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
      responseType: "json",
      redirect: "manual",
    });

    const responseHeaders = Object.fromEntries(response.headers.entries());

    const setCookieHeaders = responseHeaders["set-cookie"];
    if (setCookieHeaders) {
      const cookies = Array.isArray(setCookieHeaders)
        ? setCookieHeaders
        : [setCookieHeaders];

      const processedCookies = cookies.map((cookie) => {
        return cookie.replace(/;\s*Domain=[^;]+/gi, "");
      });

      responseHeaders["set-cookie"] = processedCookies as unknown as string;
    }

    setResponseHeaders(event, responseHeaders);

    return response._data;
  } catch (error: any) {
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || "Symfony API Error",
        data: error.data,
      });
    }

    throw createError({
      statusCode: 502,
      statusMessage: "Bad Gateway - Symfony API unreachable",
      data: { message: error.message },
    });
  }
});
