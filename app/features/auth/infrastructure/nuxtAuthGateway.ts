import type { Item } from "~/lib/hydra";
import type { AuthGateway } from "../ports/AuthGateway";
import type { AuthUser } from "../domain/auth";

export const nuxtAuthGateway: AuthGateway = {
  login(credentials) {
    return $fetch("/api/auth/login", {
      method: "POST",
      body: credentials,
    });
  },
  register(credentials) {
    return $fetch("/api/register", {
      method: "POST",
      body: credentials,
    });
  },
  logout() {
    return $fetch("/api/auth/logout", {
      method: "POST",
    });
  },
  getCurrentUser() {
    return useRequestFetch<Item<AuthUser>>()("/api/auth/me");
  },
};
