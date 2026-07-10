import { getCurrentUser } from "../application/getCurrentUser";
import { login as loginWithGateway } from "../application/login";
import { logout as logoutWithGateway } from "../application/logout";
import { register as registerWithGateway } from "../application/register";
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "../domain/auth";
import { nuxtAuthGateway } from "../infrastructure/nuxtAuthGateway";

interface AuthState {
  user: AuthUser | null;
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

function getStatusCode(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    return Number((error as { statusCode?: unknown }).statusCode);
  }
}

export const useAuth = () => {
  const state = useState<AuthState>("auth", () => ({
    user: null,
    loading: true,
    error: null,
    initialized: false,
  }));

  const checkAuth = async () => {
    state.value.loading = true;
    state.value.error = null;

    try {
      state.value.user = await getCurrentUser(nuxtAuthGateway);
    } catch (error: unknown) {
      if (getStatusCode(error) === 401 || getStatusCode(error) === 403) {
        state.value.user = null;
      } else {
        state.value.error = getErrorMessage(error, "Authentication check failed");
      }
    } finally {
      state.value.loading = false;
      state.value.initialized = true;
    }
  };

  const ensureAuth = async () => {
    if (!state.value.initialized) {
      await checkAuth();
    }
  };

  const login = async (credentials: LoginCredentials) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      await loginWithGateway(nuxtAuthGateway, credentials);
      await checkAuth();
    } catch (error: unknown) {
      state.value.error = getErrorMessage(error, "Login failed");
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      await registerWithGateway(nuxtAuthGateway, credentials);
    } catch (error: unknown) {
      state.value.error = getErrorMessage(error, "Registration failed");
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const logout = async () => {
    state.value.loading = true;
    state.value.error = null;

    try {
      await logoutWithGateway(nuxtAuthGateway);
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
    register,
    logout,
  };
};
