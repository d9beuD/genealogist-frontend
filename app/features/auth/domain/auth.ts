export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  firstname: string;
  lastname: string;
  plainPassword: string;
}

export interface AuthUser {
  id: number;
  email: string;
  [key: string]: unknown;
}
