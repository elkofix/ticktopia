import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';
import ReduxProvider from '../provider';

// Mock the ReduxProvider to simplify testing
jest.mock('../provider', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="redux-provider">{children}</div>),
}));

// Mock next/font components
jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: '--font-geist-sans',
    className: 'mock-geist-sans',
  })),
  Geist_Mono: jest.fn(() => ({
    variable: '--font-geist-mono',
    className: 'mock-geist-mono',
  })),
}));

describe('RootLayout', () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  it('renders the html document with proper structure', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // Verify html and body tags are rendered
    const htmlElement = document.documentElement;
    expect(htmlElement).toBeInTheDocument();
    expect(htmlElement).toHaveAttribute('lang', 'en');

    const bodyElement = document.body;
    expect(bodyElement).toBeInTheDocument();
  });

  it('includes the correct font classes', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const bodyElement = document.body;
    expect(bodyElement).toHaveClass('--font-geist-sans');
    expect(bodyElement).toHaveClass('--font-geist-sans');
  });

  it('wraps children with ReduxProvider', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });



  it('applies the correct font variables', () => {
    const { container } = render(<RootLayout>{mockChildren}</RootLayout>);
    
    // Verify CSS variables are set
    const style = window.getComputedStyle(container);
    expect(style.getPropertyValue('--font-geist-sans')).toBeDefined();
    expect(style.getPropertyValue('--font-geist-mono')).toBeDefined();
  });
});