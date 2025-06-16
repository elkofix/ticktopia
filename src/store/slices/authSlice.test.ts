import { AuthState, AuthUser } from '@/shared/types/user';
import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserRoles,
  clearError,
  updateUser,
} from './authSlice';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    loginTime: null,
  };

  const mockUser: AuthUser = {
    id: '123',
    name: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    isActive: true,
    roles: ['user'],
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('login actions', () => {
    it('should handle loginStart', () => {
      const action = loginStart();
      const expectedState = {
        ...initialState,
        isLoading: true,
        error: null,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
    });

    it('should handle loginSuccess', () => {
      const mockTime = Date.now();
      jest.spyOn(Date, 'now').mockImplementation(() => mockTime);
      
      const action = loginSuccess(mockUser);
      const expectedState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginTime: mockTime,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
      
      jest.spyOn(Date, 'now').mockRestore();
    });

    it('should handle loginFailure', () => {
      const error = 'Login failed';
      const action = loginFailure(error);
      const expectedState = {
        ...initialState,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error,
        loginTime: null,
      };
      expect(authReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('logout', () => {
    it('should handle logout', () => {
      const loggedInState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        loginTime: Date.now(),
      };
      const action = logout();
      expect(authReducer(loggedInState, action)).toEqual(loggedInState);
    });
  });

  describe('updateUserRoles', () => {
    it('should update user roles when user is logged in', () => {
      const loggedInState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginTime: Date.now(),
      };
      const newRoles = ['user', 'admin'];
      const action = updateUserRoles(newRoles);
      const expectedState = {
        ...loggedInState,
        user: {
          ...mockUser,
          roles: newRoles,
        },
      };
      expect(authReducer(loggedInState, action)).toEqual(expectedState);
    });

    it('should not update roles when no user is logged in', () => {
      const action = updateUserRoles(['admin']);
      expect(authReducer(initialState, action)).toEqual(initialState);
    });
  });

  describe('clearError', () => {
    it('should clear any error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      };
      const action = clearError();
      expect(authReducer(stateWithError, action)).toEqual(initialState);
    });
  });

  describe('updateUser', () => {
    it('should update the user data', () => {
      const loggedInState = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginTime: Date.now(),
      };
      const updatedUser = {
        ...mockUser,
        name: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
      };
      const action = updateUser(updatedUser);
      const expectedState = {
        ...loggedInState,
        user: updatedUser,
      };
      expect(authReducer(loggedInState, action)).toEqual(expectedState);
    });
  });
});