import type { AuthGateway } from "../ports/AuthGateway";

export function logout(gateway: AuthGateway) {
  return gateway.logout();
}
