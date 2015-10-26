import expect from 'expect';
import phone from '../phone';

describe('phone normalizer', () => {
  it('should ignore empty values', () => {
    expect(phone(undefined)).toBe(undefined);
    expect(phone(null)).toBe(null);
    expect(phone('')).toBe('');
  });

  it('should strip non-numbers', () => {
    expect(phone('abc')).toBe('');
    expect(phone('3g5')).toBe('35');
    expect(phone('a1b2c3d4e5')).toBe('123-45');
    expect(phone('987XYZ*$@6')).toBe('987-6');
  });

  it('should add dashes when typing forward', () => {
    expect(phone('123', '12')).toBe('123-');
    expect(phone('1234', '123')).toBe('123-4');
    expect(phone('123-456', '123-45')).toBe('123-456-');
  });

  it('should NOT add dashes when typing backward', () => {
    expect(phone('123', '123-')).toBe('123');
    expect(phone('12', '123')).toBe('12');
    expect(phone('123-456', '123-456-')).toBe('123-456');
    expect(phone('123-456', '123-456-7')).toBe('123-456');
  });

  it('should return formatted number if >= 10 numbers present', () => {
    expect(phone('1234567890')).toBe('123-456-7890');
    expect(phone('1234567890abcd')).toBe('123-456-7890');
    expect(phone('12a34b56c78D90')).toBe('123-456-7890');
    expect(phone('ABC1234567XYZ890')).toBe('123-456-7890');
    expect(phone('123456789012345')).toBe('123-456-7890');
    expect(phone('(800) 555 6666')).toBe('800-555-6666');
  });
});
