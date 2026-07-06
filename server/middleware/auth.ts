export default defineEventHandler(async (event: any) => {
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
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Auth validation failed",
      data: { message: error.message },
    });
  }
});
