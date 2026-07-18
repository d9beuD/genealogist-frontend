import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "../domain/auth";

export interface AuthGateway {
  login(credentials: LoginCredentials): Promise<void>;
  register(credentials: RegisterCredentials): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser>;
}
