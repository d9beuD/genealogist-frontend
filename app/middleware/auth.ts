export default defineNuxtRouteMiddleware(async () => {
  const route = useRoute();
  const { user, ensureAuth } = useAuth();

  await ensureAuth();

  if (!user.value) {
    return navigateTo({
      path: "/login",
      query: route.fullPath === "/" ? undefined : { redirect: route.fullPath },
    });
  }
});
