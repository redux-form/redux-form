import expect from 'expect'
import flattenPaths from '../flattenPaths'

describe('flattenPaths', () => {
  it('should return an empty map if no fields are provided', () => {
    expect(flattenPaths(undefined)).toEqual({})
    expect(flattenPaths(null)).toEqual({})
    expect(flattenPaths(7)).toEqual({})
    expect(flattenPaths({})).toEqual({})
    expect(flattenPaths([])).toEqual({})
  })

  it('should flatten an already flat object', () => {
    expect(flattenPaths({ a: 1, b: 2, c: 3 })).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should flatten an array into a flat object', () => {
    expect(flattenPaths([ 'a', 'b', 'c' ])).toEqual({ '0': 'a', '1': 'b', '2': 'c' })
  })

  it('should flatten an arbitrarily deep structure', () => {
    expect(flattenPaths({
      a: {
        b: {
          c: 'the',
          d: 'quick'
        },
        c: 'brown'
      },
      d: [
        'fox',
        'jumps',
        {
          e: 'over'
        }
      ]
    })).toEqual({
      'a.b.c': 'the',
      'a.b.d': 'quick',
      'a.c': 'brown',
      'd[0]': 'fox',
      'd[1]': 'jumps',
      'd[2].e': 'over'
    })
  })
})
