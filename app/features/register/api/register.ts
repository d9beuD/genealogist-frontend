import type { RegisterCredentials } from "../schema/registerCredentials";

export function registerWithCredentials(credentials: RegisterCredentials) {
  return $fetch("/api/register", {
    method: "POST",
    body: credentials,
  });
}
