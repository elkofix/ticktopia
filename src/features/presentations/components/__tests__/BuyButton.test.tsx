import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { BuyButton } from '../ByuButton';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('BuyButton', () => {
  const mockPush = jest.fn();
  const testHref = '/checkout/event-123';

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Setup the mock router
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders correctly with the correct text', () => {
    render(<BuyButton href={testHref} />);
    
    const button = screen.getByRole('button', { name: /COMPRAR BOLETOS/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-violet');
    expect(button).toHaveClass('hover:bg-brand');
  });

  it('navigates to the correct href when clicked', () => {
    render(<BuyButton href={testHref} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(testHref);
  });

  it('has the correct styling classes', () => {
    render(<BuyButton href={testHref} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-violet');
    expect(button).toHaveClass('hover:bg-brand');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('py-4');
    expect(button).toHaveClass('px-12');
    expect(button).toHaveClass('text-lg');
    expect(button).toHaveClass('font-bold');
    expect(button).toHaveClass('rounded-full');
    expect(button).toHaveClass('transition-colors');
    expect(button).toHaveClass('duration-300');
    expect(button).toHaveClass('shadow-lg');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<BuyButton href={testHref} />);
    expect(asFragment()).toMatchSnapshot();
  });
});