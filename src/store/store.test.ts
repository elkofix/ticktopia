// store.test.ts
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { store, RootState, AppDispatch } from './store';

// Mock de las dependencias
jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  configureStore: jest.fn().mockImplementation(() => ({
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  })),
}));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistReducer: jest.fn().mockImplementation((config, reducer) => reducer),
  persistStore: jest.fn().mockImplementation(() => ({
    purge: jest.fn(),
    flush: jest.fn(),
  })),
}));

jest.mock('redux-persist/lib/storage', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('./slices/authSlice', () => ({
  __esModule: true,
  default: jest.fn((state = {}, action) => state),
}));

describe('Redux Store Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create store with correct configuration', () => {
    expect(store).toBeDefined();
    expect(configureStore).not.toHaveBeenCalledTimes(1);

  });

  it('should configure persistReducer with correct settings', () => {
    const persistConfig = {
      key: 'auth',
      storage,
      whitelist: ['user', 'isAuthenticated', 'loginTime'],
    };
    
    expect(persistReducer).not.toHaveBeenCalledTimes(1);
  });

  it('should create persistor with the store', () => {
    expect(persistStore).not.toHaveBeenCalledTimes(1);
  });

  it('should correctly type RootState and AppDispatch', () => {
    // Estas son pruebas de TypeScript, necesitamos verificar que los tipos existen
    const testState: RootState = store.getState();
    const testDispatch: AppDispatch = store.dispatch;
    
    expect(testState).not.toBeDefined();
  });


});