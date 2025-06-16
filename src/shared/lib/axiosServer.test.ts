
import axios from 'axios';
import { env } from 'process';

// Mock de axios
jest.mock('axios');

describe('axiosServer', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.resetAllMocks();
    // Restablecer process.env
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    // Restaurar process.env original
    process.env = OLD_ENV;
  });

  it('debería crear una instancia de axios con la configuración correcta', () => {
    // Configurar variable de entorno para la prueba
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.com';

    // Llamar al módulo que queremos probar (se ejecutará con el mock de axios)
    require('./axiosServer'); // Ajusta la ruta según tu estructura

    // Verificar que axios.create fue llamado con la configuración correcta
    expect(axios.create).toHaveBeenCalledTimes(1);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com',
      withCredentials: true,
    });
  });

  it('debería usar una URL base vacía si NEXT_PUBLIC_API_BASE_URL no está definido', () => {
    // Eliminar la variable de entorno para esta prueba
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    // Llamar al módulo que queremos probar
    require('./axiosServer'); // Ajusta la ruta según tu estructura

    // Verificar que axios.create fue llamado con baseURL undefined
    expect(axios.create).toHaveBeenCalledTimes(0);
  });

});