import type { RegisterCredentials } from "../domain/auth";
import type { AuthGateway } from "../ports/AuthGateway";

export function register(
  gateway: AuthGateway,
  credentials: RegisterCredentials,
) {
  return gateway.register(credentials);
}
