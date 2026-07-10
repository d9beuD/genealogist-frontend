import type { RouteLocationNormalized } from "vue-router";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const { user, ensureAuth } = useAuth();

  await ensureAuth(to);

  if (!user.value) {
    return navigateTo({
      path: "/login",
      query: to.fullPath === "/" ? undefined : { redirect: to.fullPath },
    });
  }
});
