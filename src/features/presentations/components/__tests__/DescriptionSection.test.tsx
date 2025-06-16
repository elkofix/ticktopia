import React from 'react';
import { render, screen } from '@testing-library/react';
import { DescriptionSection } from '../DescriptionSection';

describe('DescriptionSection', () => {
  const testDescription = "This is a test description.\nWith multiple lines.";

  it('renders correctly with description', () => {
    render(<DescriptionSection description={testDescription} />);
    
    // Check for the title
    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
    
    // Check for the description content
  });

  it('handles empty description', () => {
    render(<DescriptionSection description="" />);
    
    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(screen.getByTestId('description-content').textContent).toBe('');
  });

  it('preserves line breaks with whitespace-pre-line', () => {
    render(<DescriptionSection description={testDescription} />);
    
    const content = screen.getByTestId('description-content');
    expect(content).toHaveClass('whitespace-pre-line');
  });

  it('matches snapshot with description', () => {
    const { asFragment } = render(<DescriptionSection description={testDescription} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with empty description', () => {
    const { asFragment } = render(<DescriptionSection description="" />);
    expect(asFragment()).toMatchSnapshot();
  });
});