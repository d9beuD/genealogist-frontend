import type { H3Event } from "#imports";

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
  const symfonyBaseUrl = config.public.symfonyBaseUrl;

  const path = getRequestURL(event).pathname;

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
    const response = await $fetch.raw(`${symfonyBaseUrl}/api/auth/validate`, {
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
      statusCode: 500,
      statusMessage: "Auth validation failed",
      data: { message: getErrorMessage(error, "Auth validation failed") },
    });
  }
});
