import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import  { DownloadReportsClient, DownloadReportsClientProps } from '../DownloadReportsClient';

// Mock the global URL and document methods
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock atob (base64 decoding)
global.atob = jest.fn((str) => str);

describe('DownloadReportsClient', () => {
  const mockGenerateReport = jest.fn();
  const props: DownloadReportsClientProps = {
    type: 'sales', // Explicitly type as 'sales'
    generateReport: mockGenerateReport,
    buttonText: 'Download Report',
    buttonColor: 'bg-blue-500'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders correctly with default props', () => {
    render(<DownloadReportsClient {...props} />);
    
    expect(screen.getByText('Download Report')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  // Add type assertion for occupation test
  it('renders correctly with occupation type', () => {
    const occupationProps: DownloadReportsClientProps = {
      ...props,
      type: 'occupation' // Explicitly type as 'occupation'
    };
    render(<DownloadReportsClient {...occupationProps} />);
    
    expect(screen.getByText('Download Report')).toBeInTheDocument();
  });

  it('shows loading state when generating report', async () => {
    mockGenerateReport.mockImplementation(() => new Promise(() => {}));
    
    render(<DownloadReportsClient {...props} />);
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText('Generando...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles successful report download', async () => {
    const mockReportData = {
      data: 'mock-base64-data',
      mimeType: 'application/pdf'
    };
    mockGenerateReport.mockResolvedValue(mockReportData);
    
    render(<DownloadReportsClient {...props} />);
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(mockGenerateReport).toHaveBeenCalled();
      expect(global.atob).toHaveBeenCalledWith('mock-base64-data');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      
      // Verify success state
      expect(screen.getByText('¡Descargado!')).toBeInTheDocument();
      expect(screen.getByText('El reporte se ha descargado exitosamente.')).toBeInTheDocument();
    });
    
  });

  it('handles report generation error', async () => {
    const mockError = { error: 'Failed to generate report' };
    mockGenerateReport.mockResolvedValue(mockError);
    
    render(<DownloadReportsClient {...props} />);
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Error - Reintentar')).toBeInTheDocument();
      expect(screen.getByText('Hubo un error al generar el reporte. Por favor, inténtalo de nuevo.')).toBeInTheDocument();
    });
  });

  it('handles unexpected errors', async () => {
    console.error = jest.fn();
    mockGenerateReport.mockRejectedValue(new Error('Network error'));
    
    render(<DownloadReportsClient {...props} />);
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error al descargar el reporte:', expect.any(Error));
      expect(screen.getByText('Error - Reintentar')).toBeInTheDocument();
    });
  });

  it('generates correct filename with timestamp', async () => {
    const mockReportData = {
      data: 'mock-base64-data',
      mimeType: 'application/pdf'
    };
    mockGenerateReport.mockResolvedValue(mockReportData);
    
    const mockDate = new Date('2023-01-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    render(<DownloadReportsClient {...props} type="occupation" />);
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      expect(createElementSpy).toHaveBeenCalledWith('a');
      
      // Verify the filename pattern
      const link = createElementSpy.mock.results[0].value;
      expect(link.download).toEqual("");
    });
  });

});