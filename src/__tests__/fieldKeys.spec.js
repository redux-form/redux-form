/**
 EXPERIMENTAL

import expect from 'expect'
import fieldKeys from '../fieldKeys'

describe('fieldKeys', () => {
  it('should return an empty array if no fields or values', () => {
    expect([ ...fieldKeys() ])
      .toEqual([])
  })

  it('should handle simple fields with no values', () => {
    expect([ ...fieldKeys(
      [ 'a', 'b', 'c' ]
    ) ])
      .toEqual([ 'a', 'b', 'c' ])
  })

  it('should handle simple fields with values', () => {
    expect([ ...fieldKeys(
      [ 'a', 'b', 'c' ],
      { a: 1, b: 2, c: 3 }
    ) ])
      .toEqual([ 'a', 'b', 'c' ])
  })

  it('should handle deep fields with no values', () => {
    expect([ ...fieldKeys(
      [ 'a.b.c', 'd.e.f' ]
    ) ])
      .toEqual([ 'a.b.c', 'd.e.f' ])
  })

  it('should handle deep fields with values', () => {
    expect([ ...fieldKeys(
      [ 'a.b.c', 'd.e.f' ],
      {
        a: {
          b: {
            c: 42
          }
        },
        d: {
          e: {
            f: 43
          }
        }
      }
    ) ])
      .toEqual([ 'a.b.c', 'd.e.f' ])
  })

  it('should handle array fields with no values', () => {
    expect([ ...fieldKeys(
      [ 'a[]', 'b.c[]', 'd[].e' ]
    ) ])
      .toEqual([ 'a[]', 'b.c[]', 'd[]' ])
  })

  it('should handle array fields with values', () => {
    expect([ ...fieldKeys(
      [ 'a[]', 'b.c[]', 'd[].e', 'f[].g' ],
      {
        a: [ 'dog', 'cat' ],
        b: {
          c: [ 'pig' ]
        },
        d: [
          { e: 'h' },
          { e: 'i' }
        ]
      }
    ) ])
      .toEqual([ 'a[0]', 'a[1]', 'b.c[0]', 'd[0].e', 'd[1].e', 'f[]' ])
  })
})

*/
