import type { H3Event } from "h3";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const path = getRequestURL(event).pathname;

  if (!path.startsWith("/api/")) {
    return;
  }

  const publicRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
  ];
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return;
  }

  const cookie = getHeader(event, "cookie");

  if (!cookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: "Authentication required" },
    });
  }

  try {
    const response = await $fetch.raw(`${apiBaseUrl}/api/me`, {
      headers: {
        cookie,
      },
    });

    if (response.status !== 200) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        data: { message: "Invalid or expired token" },
      });
    }
  } catch (error: unknown) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number((error as { statusCode?: unknown }).statusCode)
        : undefined;

    if (statusCode === 401) {
      throw error;
    }

    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: { message: getErrorMessage(error, "Authentication required") },
    });
  }
});
