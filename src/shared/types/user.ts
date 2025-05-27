export interface AuthUser {
    id: string;
    email: string;
    isActive: boolean;
    roles: string[];
}
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}