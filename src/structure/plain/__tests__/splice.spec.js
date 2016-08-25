import expect from 'expect'
import splice from '../splice'

describe('structure.plain.splice', () => {
  const testInsertWithValue = value => {
    it('should insert even when initial array is undefined', () => {
      expect(splice(undefined, 2, 0, value))  // really goes to index 0
        .toBeA('array')
        .toEqual([ , , value ])  // eslint-disable-line no-sparse-arrays
    })

    it(`should insert ${value} at start`, () => {
      expect(splice([ 'b', 'c', 'd' ], 0, 0, value))
        .toBeA('array')
        .toEqual([ value, 'b', 'c', 'd' ])
    })

    it(`should insert ${value} at end`, () => {
      expect(splice([ 'a', 'b', 'c' ], 3, 0, value))
        .toBeA('array')
        .toEqual([ 'a', 'b', 'c', value ])
    })

    it(`should insert ${value} in middle`, () => {
      expect(splice([ 'a', 'b', 'd' ], 2, 0, value))
        .toBeA('array')
        .toEqual([ 'a', 'b', value, 'd' ])
    })

    it(`should insert ${value} when index is out of range`, () => {
      expect(splice([ 'a', 'b', 'c' ], 5, 0, value))
        .toBeA('array')
        .toEqual([ 'a', 'b', 'c', , , value ])  // eslint-disable-line no-sparse-arrays
    })
  }

  testInsertWithValue('value')
  testInsertWithValue(undefined)

  it('should return empty array when removing and initial array is undefined', () => {
    expect(splice(undefined, 2, 1))
      .toBeA('array')
      .toEqual([])
  })

  it('should remove at start', () => {
    expect(splice([ 'a', 'b', 'c', 'd' ], 0, 1))
      .toBeA('array')
      .toEqual([ 'b', 'c', 'd' ])
  })

  it('should remove in the middle then insert in that position', () => {
    expect(splice([ 'a', 'b', 'c', 'd' ], 1, 1, 'e'))
      .toBeA('array')
      .toEqual([ 'a', 'e', 'c', 'd' ])
  })

  it('should remove at end', () => {
    expect(splice([ 'a', 'b', 'c', 'd' ], 3, 1))
      .toBeA('array')
      .toEqual([ 'a', 'b', 'c' ])
  })

  it('should remove in middle', () => {
    expect(splice([ 'a', 'b', 'c', 'd' ], 2, 1))
      .toBeA('array')
      .toEqual([ 'a', 'b', 'd' ])
  })
})
