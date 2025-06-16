import { render, screen, fireEvent, act } from '@testing-library/react';
import TopBar from '../TopBar';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Mock de los hooks y componentes
jest.mock('../../../features/auth/hooks/useAuth');
jest.mock('next/navigation');
jest.mock('../MobileMenuButton', () => ({
  MobileMenuButton: ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => (
    <button onClick={toggle} data-testid="mobile-menu-button">
      {isOpen ? 'Close' : 'Open'}
    </button>
  )
}));

jest.mock('../UserInfo', () => ({
  UserInfo: ({ email }: { email?: string }) => <div data-testid="user-info">{email}</div>
}));

jest.mock('../LogoutButton', () => ({
  LogoutButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid="logout-button">
      Logout
    </button>
  )
}));

jest.mock('../AuthButtons', () => ({
  AuthButtons: ({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) => (
    <div data-testid="auth-buttons">
      <button onClick={onLogin} data-testid="login-button">
        Login
      </button>
      <button onClick={onRegister} data-testid="register-button">
        Register
      </button>
    </div>
  )
}));

jest.mock('../MobileMenu', () => ({
  MobileMenu: ({ isOpen, items, onNavigate }: { 
    isOpen: boolean; 
    items: any[]; 
    onNavigate: (href: string) => void 
  }) => (
    isOpen ? <div data-testid="mobile-menu">
      {items.map(item => (
        <button key={item.href} onClick={() => onNavigate(item.href)}>
          {item.label}
        </button>
      ))}
    </div> : null
  )
}));

jest.mock('../Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>
}));

describe('TopBar Component', () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: mockLogout,
      hasAnyRole: jest.fn().mockReturnValue(false)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and auth buttons when not authenticated', () => {
    render(<TopBar />);
    
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('auth-buttons')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

  it('renders user info and logout button when authenticated', () => {
    const email = 'test@example.com';
    (useAuth as jest.Mock).mockReturnValue({
      user: { email, roles: ['client'] },
      isAuthenticated: true,
      logout: mockLogout,
      hasAnyRole: jest.fn().mockReturnValue(true)
    });
    
    render(<TopBar />);
    
    expect(screen.getByTestId('user-info')).toHaveTextContent(email);
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-buttons')).not.toBeInTheDocument();
  });

  it('shows mobile menu button when authenticated and has nav items', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', roles: ['client'] },
      isAuthenticated: true,
      logout: mockLogout,
      hasAnyRole: jest.fn().mockReturnValue(true)
    });
    
    render(<TopBar />);
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
  });

  it('does not show mobile menu button when no nav items available', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', roles: ['invalid-role'] },
      isAuthenticated: true,
      logout: mockLogout,
      hasAnyRole: jest.fn().mockReturnValue(false)
    });
    
    render(<TopBar />);
    expect(screen.queryByTestId('mobile-menu-button')).not.toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', roles: ['client'] },
      isAuthenticated: true,
      logout: mockLogout,
      hasAnyRole: jest.fn().mockReturnValue(true)
    });
    
    render(<TopBar />);
    
    const menuButton = screen.getByTestId('mobile-menu-button');
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    
    fireEvent.click(menuButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    
    fireEvent.click(menuButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', roles: ['client'] },
      isAuthenticated: true,
      logout: mockLogout,
      hasAnyRole: jest.fn().mockReturnValue(true)
    });
    
    render(<TopBar />);
    
    const logoutButton = screen.getByTestId('logout-button');
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('navigates to login when login button is clicked', () => {
    render(<TopBar />);
    
    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);
    
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('navigates to register when register button is clicked', () => {
    render(<TopBar />);
    
    const registerButton = screen.getByTestId('register-button');
    fireEvent.click(registerButton);
    
    expect(mockPush).toHaveBeenCalledWith('/auth/register');
  });

  it('filters navigation items based on user roles', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', roles: ['client'] },
      isAuthenticated: true,
      logout: mockLogout,
      hasAnyRole: (roles: string[]) => roles.includes('client')
    });
    
    render(<TopBar />);
    fireEvent.click(screen.getByTestId('mobile-menu-button'));
    
    // Solo deberían aparecer los items para 'client'
    expect(screen.getByText('Mis Tickets')).toBeInTheDocument();
    expect(screen.getByText('Mi historial')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
  });

});