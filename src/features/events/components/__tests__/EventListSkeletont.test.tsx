import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventListSkeleton } from '../EventListSkeleton'; // Adjust the import path

describe('EventListSkeleton', () => {
  it('renders the correct number of skeleton items', () => {
    render(<EventListSkeleton />);
    
    const skeletonItems = screen.getAllByTestId('skeleton-item');
    expect(skeletonItems).toHaveLength(3);
  });

  it('has the correct container structure and classes', () => {
    render(<EventListSkeleton />);
    
    const container = screen.getByTestId('skeleton-container');
    expect(container).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6', 'mb-8');
  });

  it('each skeleton item has the correct structure', () => {
    render(<EventListSkeleton />);
    
    const firstItem = screen.getAllByTestId('skeleton-item')[0];
    
    // Check container classes
    expect(firstItem).toHaveClass('bg-gray-100', 'rounded-lg', 'overflow-hidden', 'animate-pulse');
    
    // Check image placeholder
    const imagePlaceholder = firstItem.querySelector('[data-testid="skeleton-image"]');
    expect(imagePlaceholder).toHaveClass('h-48', 'bg-gray-200');
    
    // Check content placeholders
    const contentContainer = firstItem.querySelector('[data-testid="skeleton-content"]');
    expect(contentContainer).toBeInTheDocument();
    
    const titlePlaceholder = contentContainer?.querySelector('[data-testid="skeleton-title"]');
    expect(titlePlaceholder).toHaveClass('h-6', 'bg-gray-200', 'rounded', 'w-3/4', 'mb-2');
    
    const subtitlePlaceholder = contentContainer?.querySelector('[data-testid="skeleton-subtitle"]');
    expect(subtitlePlaceholder).toHaveClass('h-4', 'bg-gray-200', 'rounded', 'w-1/2', 'mb-2');
    
    const metaPlaceholder = contentContainer?.querySelector('[data-testid="skeleton-meta"]');
    expect(metaPlaceholder).toHaveClass('h-4', 'bg-gray-200', 'rounded', 'w-1/4');
  });

  it('applies animation to all skeleton items', () => {
    render(<EventListSkeleton />);
    
    const skeletonItems = screen.getAllByTestId('skeleton-item');
    skeletonItems.forEach(item => {
      expect(item).toHaveClass('animate-pulse');
    });
  });
});