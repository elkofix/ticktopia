import React from 'react';
import { render, screen } from '@testing-library/react';
import { PriceCard } from '../PriceCard';
import '@testing-library/jest-dom';

describe('PriceCard', () => {
  it('renders correctly with the provided price', () => {
    const testPrice = 49.99;
    render(<PriceCard price={testPrice} />);

    // Check container
    const container = screen.getByTestId('price-card');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('p-6');
    expect(container).toHaveClass('rounded-xl');
    expect(container).toHaveClass('shadow-md');

    // Check title
    const title = screen.getByText('Asiento General');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('text-gray-700');

    // Check price
    const priceElement = screen.getByText(`$${testPrice.toFixed(2)}`);
    expect(priceElement).toBeInTheDocument();
    expect(priceElement).toHaveClass('text-xl');
    expect(priceElement).toHaveClass('font-bold');
    expect(priceElement).toHaveClass('text-blue-600');
  });

  it('formats the price to 2 decimal places', () => {
    const testPrice = 50;
    render(<PriceCard price={testPrice} />);
    
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('handles zero price correctly', () => {
    render(<PriceCard price={0} />);
    
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('handles large prices correctly', () => {
    const largePrice = 1234567.89;
    render(<PriceCard price={largePrice} />);
    
    expect(screen.getByText('$1234567.89')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<PriceCard price={49.99} />);
    expect(asFragment()).toMatchSnapshot();
  });
});