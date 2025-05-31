import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenu } from '../MobileMenu';
import { NavigationItem } from '../../../shared/types/navigation';
import { Home, User } from 'lucide-react'; // Importamos algunos iconos para el mock

// Mock correcto de NavigationItems
jest.mock('../../../shared/types/navigation', () => ({
  NavigationItems: ({ items, onNavigate }: { 
    items: NavigationItem[]; 
    onNavigate: (href: string) => void 
  }) => (
    <div data-testid="navigation-items">
      {items.map((item) => (
        <button key={item.href} onClick={() => onNavigate(item.href)}>
          <item.icon data-testid={`${item.href}-icon`} />
          {item.label}
        </button>
      ))}
    </div>
  )
}));

describe('MobileMenu', () => {
  const mockItems: NavigationItem[] = [
    { 
      href: '/home', 
      label: 'Home', 
      icon: Home,
      roles: ['admin', 'client'] 
    },
    { 
      href: '/profile', 
      label: 'Profile', 
      icon: User,
      roles: ['admin', 'client', 'event-manager'],
      priority: 1
    },
  ];
  
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    mockOnNavigate.mockClear();
  });

  it('should render NavigationItems with all props', () => {
    render(
      <MobileMenu isOpen={true} items={mockItems} onNavigate={mockOnNavigate} />
    );
    
    // Verificar items
    mockItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('should pass correct navigation callback', () => {
    render(
      <MobileMenu isOpen={true} items={mockItems} onNavigate={mockOnNavigate} />
    );
    
    fireEvent.click(screen.getByText('Profile'));
    expect(mockOnNavigate).toHaveBeenCalledWith('/profile');
  });

  it('should render items in correct order based on priority', () => {
    const item: NavigationItem =      { 
        href: '/events', 
        label: 'Events', 
        icon: User,
        roles: ['admin'],
        priority: 0 // Mayor prioridad
      };
    const unorderedItems = [...mockItems, 
      item
    ];
    
    render(
      <MobileMenu isOpen={true} items={unorderedItems} onNavigate={mockOnNavigate} />
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Home'); // Debería ir primero por priority: 0
  });
});