import keys from '../keys'

describe('structure.plain.keys', () => {
  it('should return empty array if state is undefined', () => {
    expect(keys(undefined)).toEqual([])
  })

  it('should return empty if no keys', () => {
    expect(keys({})).toEqual([])
  })

  it('should return keys', () => {
    expect(
      keys({
        a: 1,
        b: 2,
        c: 3
      })
    ).toEqual(['a', 'b', 'c'])
  })
})
