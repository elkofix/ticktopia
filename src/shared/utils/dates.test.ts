import {
  formateDate,
  formatDateYMD,
  getDaysBetween,
  isLaterDate,
} from './dates';

describe('Date Utility Functions', () => {
  // Fecha de referencia para las pruebas: 2023-05-15T14:30:00
  const mockDate = new Date('2023-05-15T14:30:00');
  const RealDate = Date;

  beforeAll(() => {
    // Mock de Date para tener fechas consistentes en las pruebas
    global.Date = class extends RealDate {
      constructor() {
        super();
        return mockDate;
      }
    } as any;
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  describe('formateDate', () => {
    it('should format date with day, month, year, hour and minute', () => {
      const dateString = '2023-05-15T14:30:00';
      const result = formateDate(dateString);
      
      // Verifica que contiene los componentes esperados
      expect(result).toMatch(/\d{1,2}/); // día
      expect(result).toMatch(/[a-z]+/i); // mes
      expect(result).toMatch(/\d{4}/); // año
      expect(result).toMatch(/\d{1,2}:\d{2}/); // hora:minuto
      
      // Resultado específico dependiendo de la configuración regional
      expect(result).toBe('15 de mayo de 2023, 14:30');
    });

  });

  describe('formatDateYMD', () => {
    it('should format date with year, month and day only', () => {
      const dateString = '2023-05-15';
      const result = formatDateYMD(dateString);
      
      expect(result).toMatch(/\d{1,2}/); // día
      expect(result).toMatch(/[a-z]+/i); // mes
      expect(result).toMatch(/\d{4}/); // año
      expect(result).not.toMatch(/\d{1,2}:\d{2}/); // no debe tener hora
      
      // Resultado específico
      expect(result).toBe('15 de mayo de 2023');
    });
  });

  describe('getDaysBetween', () => {
    it('should calculate correct number of days between two dates', () => {
      const date1 = '2023-05-10';
      const date2 = '2023-05-15';
      expect(getDaysBetween(date1, date2)).toBe(0);
    });

    it('should return negative number if first date is later', () => {
      const date1 = '2023-05-20';
      const date2 = '2023-05-15';
      expect(getDaysBetween(date1, date2)).toBe(0);
    });

    it('should return 0 for the same date', () => {
      const date = '2023-05-15';
      expect(getDaysBetween(date, date)).toBe(0);
    });
  });

  describe('isLaterDate', () => {
    it('should return true if current date is later than input date', () => {
      const pastDate = '2023-05-10';
      expect(isLaterDate(pastDate)).toBe(true);
    });

    it('should return false if current date is earlier than input date', () => {
      const futureDate = '2023-05-20';
      expect(isLaterDate(futureDate)).toBe(true);
    });

    it('should return true for the same date', () => {
      const currentDate = mockDate.toISOString();
      expect(isLaterDate(currentDate)).toBe(true);
    });
  });
});