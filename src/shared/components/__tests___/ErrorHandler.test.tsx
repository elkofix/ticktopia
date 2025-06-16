import { render } from '@testing-library/react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { redirect } from 'next/navigation';
import ErrorHandler from '../ErrorHandler';

// Mock de los módulos necesarios
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('../../../features/auth/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('ErrorHandler', () => {
  const mockLogout = jest.fn();
  const mockCheckSessionExpiration = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      checkSessionExpiration: mockCheckSessionExpiration,
      logout: mockLogout,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe redirigir a login y hacer logout cuando el error es 401', () => {
    const error = { status: 401 };
    
    // Mock de console.log para no mostrar logs en las pruebas
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ErrorHandler {...error} />);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith('/auth/login?logout=true');
    consoleSpy.mockRestore();
  });

  it('debe redirigir a login y hacer logout cuando el error.response es 401', () => {
    const error = { response: { status: 401 } };
    
    render(<ErrorHandler {...error} />);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith('/auth/login?logout=true');
  });

  it('debe redirigir a login y hacer logout cuando checkSessionExpiration devuelve true', () => {
    const error = {};
    mockCheckSessionExpiration.mockReturnValue(true);
    
    render(<ErrorHandler {...error} />);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith('/auth/login?logout=true');
  });

  it('debe mostrar ErrorCard con el mensaje de error cuando no es 401', () => {
    const error = { 
      response: { 
        data: { 
          message: 'Error específico' 
        } 
      } 
    };
    
    const { getByText } = render(<ErrorHandler {...error} />);
    
    expect(getByText('Error específico')).toBeInTheDocument();
  });

  it('debe mostrar el mensaje por defecto cuando no hay mensaje de error', () => {
    const error = {};
    
    const { getByText } = render(<ErrorHandler {...error} />);
    
    expect(getByText('Ocurrió un error inesperado, intenta más tarde')).toBeInTheDocument();
  });

  it('debe mostrar el mensaje por defecto cuando el error no tiene la estructura esperada', () => {
    const error = { someOtherProperty: 'value' };
    
    const { getByText } = render(<ErrorHandler {...error} />);
    
    expect(getByText('Ocurrió un error inesperado, intenta más tarde')).toBeInTheDocument();
  });
});