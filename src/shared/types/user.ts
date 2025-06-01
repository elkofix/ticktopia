  export interface AuthUser {
      id: string;
      name: string;
      lastname: string;
      email: string;
      isActive: boolean;
      roles: string[];
  }
  export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    loginTime: number | null; // timestamp en milisegundos
  }
