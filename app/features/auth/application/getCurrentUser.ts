import type { AuthUser } from "../domain/auth";
import type { AuthGateway } from "../ports/AuthGateway";

export async function getCurrentUser(gateway: AuthGateway): Promise<AuthUser> {
  return await gateway.getCurrentUser();
}
