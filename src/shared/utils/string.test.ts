import { getLastSixChars } from './string';

describe('getLastSixChars', () => {
  it('should return the last 6 characters in uppercase', () => {
    expect(getLastSixChars('abcdefghijkl')).toBe('GHIJKL');
    expect(getLastSixChars('1234567890')).toBe('567890');
    expect(getLastSixChars('abcDEF123456')).toBe('123456');
  });

  it('should return the entire string in uppercase if length is 6 or less', () => {
    expect(getLastSixChars('abc123')).toBe('ABC123');
    expect(getLastSixChars('xyz')).toBe('XYZ');
    expect(getLastSixChars('1')).toBe('1');
  });

  it('should handle empty string', () => {
    expect(getLastSixChars('')).toBe('');
  });

  it('should handle strings with special characters', () => {
    expect(getLastSixChars('!@#$%^&*()')).toBe('%^&*()');
    expect(getLastSixChars('a@b#c$d%')).toBe('B#C$D%');
  });

  it('should handle unicode characters', () => {
    expect(getLastSixChars('ñáéíóú123456')).toBe('123456');
    expect(getLastSixChars('😊🚀🌟🎉')).toBe('🚀🌟🎉');
  });
});