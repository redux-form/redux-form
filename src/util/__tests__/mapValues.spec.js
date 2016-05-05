import expect from 'expect'
import noop from '../noop'
import mapValues from '../mapValues'

describe('mapValues', () => {
  it('should return undefined when given undefined', () => {
    expect(mapValues(undefined, noop))
      .toBe(undefined)
  })

  it('should return null when given null', () => {
    expect(mapValues(null, noop))
      .toBe(null)
  })

  it('should call a function on each value', () => {
    expect(mapValues({
      a: 1,
      b: 2,
      c: 3,
      d: 4
    }, value => value * 2))
      .toBeA('object')
      .toEqual({
        a: 2,
        b: 4,
        c: 6,
        d: 8
      })
  })
})
