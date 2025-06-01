import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Logo } from '../Logo';

// Mock de next/link para simplificar las pruebas
jest.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  Link.displayName = 'Link';
  return Link;
});

describe('Logo Component', () => {
  test('renders correctly with link to home', () => {
    render(<Logo />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  test('displays the correct text', () => {
    render(<Logo />);
    
    const logoText = screen.getByText('TickTopia');
    expect(logoText).toBeInTheDocument();
  });

  test('has the correct styling classes', () => {
    render(<Logo />);
    
    const logoText = screen.getByText('TickTopia');
    expect(logoText).toHaveClass('text-2xl');
    expect(logoText).toHaveClass('font-bold');
    expect(logoText).toHaveClass('bg-gradient-to-r');
    expect(logoText).toHaveClass('from-brand');
    expect(logoText).toHaveClass('via-violet');
    expect(logoText).toHaveClass('to-wisteria');
    expect(logoText).toHaveClass('bg-clip-text');
    expect(logoText).toHaveClass('text-transparent');
  });

  test('has cursor-pointer class', () => {
    render(<Logo />);
    
    const logoText = screen.getByText('TickTopia');
    expect(logoText).toHaveClass('cursor-pointer');
  });

  test('is wrapped in an h1 tag', () => {
    render(<Logo />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('TickTopia');
  });
});