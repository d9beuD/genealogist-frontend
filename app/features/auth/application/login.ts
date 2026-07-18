import type { LoginCredentials } from "../domain/auth";
import type { AuthGateway } from "../ports/AuthGateway";

export function login(gateway: AuthGateway, credentials: LoginCredentials) {
  return gateway.login(credentials);
}
