import expect from 'expect'
import normalizeMin from '../normalizeMin'

describe('normalizeMin', () => {
  it('should do nothing when max does not change', () => {
    expect(normalizeMin(undefined, undefined, { max: undefined }, { max: undefined })).toBe(undefined)
    expect(normalizeMin(3, undefined, { max: 4 }, { max: 4 })).toBe(3)
    expect(normalizeMin('8', undefined, { max: '4' }, { max: '4' })).toBe('8')
    expect(normalizeMin(42, undefined, {}, {})).toBe(42)
  })

  it('should do set min when max changes but and min is undefined', () => {
    expect(normalizeMin(undefined, undefined, { max: '4' }, { max: '3' })).toBe('4')
  })

  it('should do nothing when max changes but is higher than min', () => {
    expect(normalizeMin(3, undefined, { max: 5 }, { max: 6 })).toBe(3)
    expect(normalizeMin('7', undefined, { max: '9' }, { max: '10' })).toBe('7')
  })

  it('should do raise min when max changes and is lower than min', () => {
    expect(normalizeMin(5, undefined, { max: 4 }, { max: 8 })).toBe(4)
    expect(normalizeMin('4', undefined, { max: '3' }, { max: '9' })).toBe('3')
  })

})
