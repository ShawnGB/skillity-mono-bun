export type UserRole = 'admin' | 'host' | 'guest';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  bio?: string | null;
  tagline?: string | null;
  profession?: string | null;
  city?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}
