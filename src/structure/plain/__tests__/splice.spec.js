import expect from 'expect'
import splice from '../splice'

describe('structure.plain.splice', () => {
  it('should insert even when initial array is undefined', () => {
    expect(splice(undefined, 2, 0, 'foo'))  // really goes to index 0
      .toBeA('array')
      .toEqual([ , , 'foo' ])  // eslint-disable-line no-sparse-arrays
  })

  it('should insert at start', () => {
    expect(splice([ 'b', 'c', 'd' ], 0, 0, 'a'))
      .toBeA('array')
      .toEqual([ 'a', 'b', 'c', 'd' ])
  })

  it('should insert at end', () => {
    expect(splice([ 'a', 'b', 'c' ], 3, 0, 'd'))
      .toBeA('array')
      .toEqual([ 'a', 'b', 'c', 'd' ])
  })

  it('should insert in middle', () => {
    expect(splice([ 'a', 'b', 'd' ], 2, 0, 'c'))
      .toBeA('array')
      .toEqual([ 'a', 'b', 'c', 'd' ])
  })

  it('should insert in out of range', () => {
    expect(splice([ 'a', 'b', 'c' ], 5, 0, 'f'))
      .toBeA('array')
      .toEqual([ 'a', 'b', 'c', , , 'f' ])  // eslint-disable-line no-sparse-arrays
  })

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
