import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventListPagination } from '../EventListPagination'; // Adjust the import path

describe('EventListPagination', () => {
  const mockProps = {
    currentPage: 2,
    totalPages: 5,
    itemsPerPage: 10,
    totalItems: 47,
    hasMoreData: true,
    loading: false,
    onLoadMore: jest.fn(),
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all components correctly', () => {
    render(<EventListPagination {...mockProps} />);
    
    // Check main container
    const container = screen.getByTestId('pagination-container');
    expect(container).toHaveClass('flex', 'flex-col', 'sm:flex-row');
    
    // Load More button
    const loadMoreBtn = screen.getByRole('button', { name: /Cargar Más/i });
    expect(loadMoreBtn).toBeInTheDocument();
    
    // Previous page button
    const prevBtn = screen.getByLabelText('Previous page');
    expect(prevBtn).toBeInTheDocument();
    
    // Next page button
    const nextBtn = screen.getByLabelText('Next page');
    expect(nextBtn).toBeInTheDocument();
    
    // Page numbers
    const pageButtons = screen.getAllByRole('button', { name: /^[0-9]+$/ });
    expect(pageButtons.length).toBe(Math.min(5, mockProps.totalPages));
    
    // Current page should be active
    const activeButton = screen.getByRole('button', { name: String(mockProps.currentPage) });
    expect(activeButton).toHaveClass('bg-brand', 'text-white');
    
    // Items count text
    const startItem = ((mockProps.currentPage - 1) * mockProps.itemsPerPage) + 1;
    const endItem = Math.min(mockProps.currentPage * mockProps.itemsPerPage, mockProps.totalItems);
    expect(screen.getByText(`Mostrando ${startItem}-${endItem} de ${mockProps.totalItems}`)).toBeInTheDocument();
  });

  it('handles load more button click', () => {
    render(<EventListPagination {...mockProps} />);
    const loadMoreBtn = screen.getByRole('button', { name: /Cargar Más/i });
    fireEvent.click(loadMoreBtn);
    expect(mockProps.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('disables load more button when loading', () => {
    render(<EventListPagination {...mockProps} loading={true} />);
    const loadMoreBtn = screen.getByRole('button', { name: /Cargando.../i });
    expect(loadMoreBtn).toBeDisabled();
    expect(loadMoreBtn).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('handles previous page button click', () => {
    render(<EventListPagination {...mockProps} />);
    const prevBtn = screen.getByLabelText('Previous page');
    fireEvent.click(prevBtn);
    expect(mockProps.onPageChange).toHaveBeenCalledWith(mockProps.currentPage - 1);
  });

  it('disables previous button on first page', () => {
    render(<EventListPagination {...mockProps} currentPage={1} />);
    const prevBtn = screen.getByLabelText('Previous page');
    expect(prevBtn).toBeDisabled();
  });

  it('handles next page button click', () => {
    render(<EventListPagination {...mockProps} />);
    const nextBtn = screen.getByLabelText('Next page');
    fireEvent.click(nextBtn);
    expect(mockProps.onPageChange).toHaveBeenCalledWith(mockProps.currentPage + 1);
  });

  it('disables next button on last page', () => {
    render(<EventListPagination {...mockProps} currentPage={mockProps.totalPages} />);
    const nextBtn = screen.getByLabelText('Next page');
    expect(nextBtn).toBeDisabled();
  });

  it('handles page number button clicks', () => {
    render(<EventListPagination {...mockProps} />);
    const pageButtons = screen.getAllByRole('button', { name: /^[0-9]+$/ });
    
    pageButtons.forEach((button, index) => {
      fireEvent.click(button);
      expect(mockProps.onPageChange).toHaveBeenCalledWith(index + 1);
    });
  });

  it('hides load more button when no more data', () => {
    render(<EventListPagination {...mockProps} hasMoreData={false} />);
    expect(screen.queryByRole('button', { name: /Cargar Más/i })).not.toBeInTheDocument();
  });

  it('shows correct item count range', () => {
    const testProps = {
      ...mockProps,
      currentPage: 3,
      itemsPerPage: 10,
      totalItems: 27,
    };
    render(<EventListPagination {...testProps} />);
    expect(screen.getByText('Mostrando 21-27 de 27')).toBeInTheDocument();
  });
});