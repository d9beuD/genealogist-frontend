import type { AuthGateway } from "../ports/AuthGateway";

export function getCurrentUser(gateway: AuthGateway) {
  return gateway.getCurrentUser();
}
