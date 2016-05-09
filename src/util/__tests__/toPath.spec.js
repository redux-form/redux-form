import expect from 'expect'
import toPath from '../toPath'

describe('toPath', () => {
  it('should return empty array for null', () => {
    expect(toPath(null)).toEqual([])
  })

  it('should return empty array for undefined', () => {
    expect(toPath(undefined)).toEqual([])
  })

  it('should return empty array for empty string', () => {
    expect(toPath('')).toEqual([])
  })

  it('should return array with string for a number', () => {
    expect(toPath(42)).toEqual([ '42' ])
  })

  it('should split dots', () => {
    expect(toPath('a.b.c')).toEqual([ 'a', 'b', 'c' ])
  })

  it('should split brackets', () => {
    expect(toPath('a[1][2]')).toEqual([ 'a', '1', '2' ])
  })

  it('should split mixed dots and brackets', () => {
    expect(toPath('a[1].b.c[2].d')).toEqual([ 'a', '1', 'b', 'c', '2', 'd' ])
  })
})
