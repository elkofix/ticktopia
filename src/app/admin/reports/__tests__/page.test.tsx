import { render, screen } from '@testing-library/react';
import ReportsPage from '../page';
import { generateOccupationReport, generateSalesReport } from '../../../../features/reports/reports.api';

// Mock del componente DownloadReportsClient
jest.mock('../../../../features/reports/components/DownloadReportsClient', () => ({
  DownloadReportsClient: jest.fn(({ type, buttonText }) => (
    <button data-testid={`download-${type}-button`}>{buttonText}</button>
  ))
}));

// Mock de las funciones de API
jest.mock('../../../../features/reports/reports.api', () => ({
  generateOccupationReport: jest.fn(),
  generateSalesReport: jest.fn(),
}));

describe('ReportsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar correctamente el título y descripción', () => {
    render(<ReportsPage />);
    
    expect(screen.getByText('Generador de Reportes')).toBeInTheDocument();
    expect(screen.getByText('Descarga reportes detallados de ventas y ocupación en formato PDF con un solo clic')).toBeInTheDocument();
  });

  it('debe mostrar las dos tarjetas de reportes', () => {
    render(<ReportsPage />);
    
    expect(screen.getByText('Reporte de Ventas')).toBeInTheDocument();
    expect(screen.getByText('Reporte de Ocupación')).toBeInTheDocument();
  });

  it('debe mostrar las características del reporte de ventas', () => {
    render(<ReportsPage />);
    
    expect(screen.getByText('Tickets por evento')).toBeInTheDocument();
    expect(screen.getByText('Tickets por vendedor')).toBeInTheDocument();
    expect(screen.getByText('Análisis de rendimiento')).toBeInTheDocument();
  });

  it('debe mostrar las características del reporte de ocupación', () => {
    render(<ReportsPage />);
    
    expect(screen.getByText('Tickets totales vs canjeados')).toBeInTheDocument();
    expect(screen.getByText('Ratios de ocupación')).toBeInTheDocument();
    expect(screen.getByText('Resumen estadístico')).toBeInTheDocument();
  });

  it('debe renderizar el componente DownloadReportsClient para ventas', () => {
    render(<ReportsPage />);
    
    expect(screen.getByTestId('download-sales-button')).toHaveTextContent('Descargar Reporte de Ventas');
  });

  it('debe renderizar el componente DownloadReportsClient para ocupación', () => {
    render(<ReportsPage />);
    
    expect(screen.getByTestId('download-occupation-button')).toHaveTextContent('Descargar Reporte de Ocupación');
  });


});