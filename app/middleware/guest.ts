export default defineNuxtRouteMiddleware(async () => {
  const { user, ensureAuth } = useAuth();

  await ensureAuth();

  if (user.value) {
    return navigateTo("/");
  }
});
