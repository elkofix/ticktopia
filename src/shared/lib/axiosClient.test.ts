// axiosServer.test.ts
import axios from 'axios';
import axiosServer from './axiosServer';

// Mock más simple y estable de axios
jest.mock('axios', () => {
  const originalAxios = jest.requireActual('axios');
  const mockAxiosInstance = {
    ...originalAxios.create(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
  return {
    ...originalAxios,
    create: jest.fn(() => mockAxiosInstance)
  };
});

describe('axiosServer Configuration', () => {
  beforeAll(() => {
    // Configurar environment para pruebas
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.com';
  });

  afterAll(() => {
    // Limpiar environment después de pruebas
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  });

  it('should return the created instance', () => {
    expect(axiosServer).toBeDefined();
    expect(axiosServer.interceptors).toBeDefined();
  });

  it('should have withCredentials set to true', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({ withCredentials: true })
    );
  });
});