import { render, screen } from '@testing-library/react';
import LoginPage from '../page';

// Mock del componente LoginComponent para aislar las pruebas
jest.mock('../../../../features/auth/login/components/LoginComponent', () => {
  return function MockLoginComponent() {
    return <div data-testid="mock-login-component">Mock Login Component</div>;
  };
});

describe('LoginPage', () => {
  it('debe renderizar correctamente', () => {
    render(<LoginPage />);
    
    // Verificar que el componente se renderiza sin errores
    expect(screen.getByTestId('mock-login-component')).toBeInTheDocument();
  });

  it('debe contener el LoginComponent', () => {
    render(<LoginPage />);
    
    // Verificar que el LoginComponent está presente
    expect(screen.getByText('Mock Login Component')).toBeInTheDocument();
  });

  it('no debe renderizar otros componentes adicionales', () => {
    render(<LoginPage />);
    
    // Verificar que solo hay un componente hijo
    const container = screen.getByTestId('mock-login-component').parentElement;
    expect(container?.children.length).toBe(1);
  });
});