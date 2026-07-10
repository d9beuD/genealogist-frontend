import type { RouteLocationNormalized } from "vue-router";
import { loginWithCredentials } from "~/features/login/api/login";
import type { LoginCredentials } from "~/features/login/schema/loginCredentials";

interface User {
  id: number;
  email: string;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

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

export const useAuth = () => {
  const state = useState<AuthState>("auth", () => ({
    user: null,
    loading: true,
    error: null,
    initialized: false,
  }));

  const checkAuth = async (route?: RouteLocationNormalized) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const user = await $fetch<User>("/api/auth/me");
      state.value.user = user;
    } catch (error: unknown) {
      const statusCode =
        typeof error === "object" && error !== null && "statusCode" in error
          ? Number((error as { statusCode?: unknown }).statusCode)
          : undefined;

      if (statusCode === 401 || statusCode === 403) {
        state.value.user = null;

        if (route && route.path !== "/login") {
          await navigateTo({
            path: "/login",
            query: route.fullPath === "/"
              ? undefined
              : { redirect: route.fullPath },
          });
        }
      } else {
        state.value.error = getErrorMessage(
          error,
          "Authentication check failed",
        );
      }
    } finally {
      state.value.loading = false;
      state.value.initialized = true;
    }
  };

  const ensureAuth = async (route?: RouteLocationNormalized) => {
    if (state.value.initialized) {
      return;
    }

    await checkAuth(route);
  };

  const login = async (credentials: LoginCredentials) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const result = await loginWithCredentials(credentials);

      await checkAuth();

      return result;
    } catch (error: unknown) {
      state.value.error = getErrorMessage(error, "Login failed");
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
    } catch (error: unknown) {
      state.value.error = getErrorMessage(error, "Logout failed");
    } finally {
      state.value.loading = false;
    }
  };

  return {
    user: computed(() => state.value.user),
    loading: computed(() => state.value.loading),
    error: computed(() => state.value.error),
    initialized: computed(() => state.value.initialized),
    checkAuth,
    ensureAuth,
    login,
    logout,
  };
};
