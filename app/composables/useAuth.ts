interface User {
  id: number;
  email: string;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const state = useState<AuthState>("auth", () => ({
    user: null,
    loading: true,
    error: null,
  }));

  const checkAuth = async () => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const user = await $fetch<User>("/api/auth/me");
      state.value.user = user;
    } catch (error: any) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        state.value.user = null;
      } else {
        state.value.error = error.message || "Authentication check failed";
      }
    } finally {
      state.value.loading = false;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const result = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      await checkAuth();

      return result;
    } catch (error: any) {
      state.value.error = error.message || "Login failed";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const logout = async () => {
    state.value.loading = true;

    try {
      await $fetch("/api/auth/logout", {
        method: "POST",
      });

      state.value.user = null;
    } catch (error: any) {
      state.value.error = error.message || "Logout failed";
    } finally {
      state.value.loading = false;
    }
  };

  onMounted(() => {
    checkAuth();
  });

  if (import.meta.server) {
    checkAuth();
  }

  return {
    user: computed(() => state.value.user),
    loading: computed(() => state.value.loading),
    error: computed(() => state.value.error),
    checkAuth,
    login,
    logout,
  };
};
