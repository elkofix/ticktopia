import { AuthState, AuthUser } from '@/shared/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginTime: null,

};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.loginTime = Date.now(); // <-- guardamos el timestamp aquí

    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
      state.loginTime = null; // <-- limpiamos
      state.loginTime = null; // <-- limpiamos


    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    updateUserRoles: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.roles = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserRoles,
  clearError,
  updateUser
} = authSlice.actions;

export default authSlice.reducer;
