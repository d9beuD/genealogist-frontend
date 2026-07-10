import type { RouteLocationNormalized } from "vue-router";

export default defineNuxtRouteMiddleware(
  async (to: RouteLocationNormalized) => {
    const { user, ensureAuth } = useAuth();

    await ensureAuth(to);

    if (user.value) {
      const redirect = to.query.redirect;
      return navigateTo(typeof redirect === "string" ? redirect : "/");
    }
  },
);
