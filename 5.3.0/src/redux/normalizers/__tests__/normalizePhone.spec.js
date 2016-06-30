import expect from 'expect'
import normalizePhone from '../normalizePhone'

describe('normalizePhone', () => {
  it('should ignore empty values', () => {
    expect(normalizePhone(undefined)).toBe(undefined)
    expect(normalizePhone(null)).toBe(null)
    expect(normalizePhone('')).toBe('')
  })

  it('should strip non-numbers', () => {
    expect(normalizePhone('abc')).toBe('')
    expect(normalizePhone('3g5')).toBe('35')
    expect(normalizePhone('a1b2c3d4e5')).toBe('123-45')
    expect(normalizePhone('987XYZ*$@6')).toBe('987-6')
  })

  it('should add dashes when typing forward', () => {
    expect(normalizePhone('123', '12')).toBe('123-')
    expect(normalizePhone('1234', '123')).toBe('123-4')
    expect(normalizePhone('123-456', '123-45')).toBe('123-456-')
  })

  it('should NOT add dashes when typing backward', () => {
    expect(normalizePhone('123', '123-')).toBe('123')
    expect(normalizePhone('12', '123')).toBe('12')
    expect(normalizePhone('123-456', '123-456-')).toBe('123-456')
    expect(normalizePhone('123-456', '123-456-7')).toBe('123-456')
  })

  it('should return formatted number if >= 10 numbers present', () => {
    expect(normalizePhone('1234567890')).toBe('123-456-7890')
    expect(normalizePhone('1234567890abcd')).toBe('123-456-7890')
    expect(normalizePhone('12a34b56c78D90')).toBe('123-456-7890')
    expect(normalizePhone('ABC1234567XYZ890')).toBe('123-456-7890')
    expect(normalizePhone('123456789012345')).toBe('123-456-7890')
    expect(normalizePhone('(800) 555 6666')).toBe('800-555-6666')
  })
})
