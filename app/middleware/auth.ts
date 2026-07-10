import type { RouteLocationNormalized } from "vue-router";

export default defineNuxtRouteMiddleware(
  async (to: RouteLocationNormalized) => {
    const { user, ensureAuth } = useAuth();
    const localePath = useLocalePath();

    await ensureAuth();

    if (!user.value) {
      return navigateTo({
        path: localePath("/login"),
        query: to.fullPath === "/" ? undefined : { redirect: to.fullPath },
      });
    }
  },
);
