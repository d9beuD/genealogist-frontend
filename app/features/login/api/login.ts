import type { LoginCredentials } from "../schema/loginCredentials";

export function loginWithCredentials(credentials: LoginCredentials) {
  return $fetch("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}
