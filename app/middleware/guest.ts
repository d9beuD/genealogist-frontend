export default defineNuxtRouteMiddleware(async () => {
  const route = useRoute();
  const { user, ensureAuth } = useAuth();

  await ensureAuth();

  if (user.value) {
    const redirect = route.query.redirect;
    return navigateTo(typeof redirect === "string" ? redirect : "/");
  }
});
