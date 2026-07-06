export default defineNuxtPlugin(async () => {
  const { ensureAuth } = useAuth();

  await ensureAuth();
});
