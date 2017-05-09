import expect from 'expect'
import getIn from '../getIn'

describe('structure.plain.getIn', () => {
  it('should return undefined if state is undefined', () => {
    expect(getIn(undefined, 'dog')).toBe(undefined)
  })

  it('should return undefined if any step on the path is undefined', () => {
    expect(
      getIn(
        {
          a: {
            b: {},
          },
        },
        'a.b.c'
      )
    ).toBe(undefined)
  })

  it('should get shallow values', () => {
    expect(getIn({foo: 'bar'}, 'foo')).toBe('bar')
    expect(getIn({foo: 42}, 'foo')).toBe(42)
    expect(getIn({foo: false}, 'foo')).toBe(false)
  })

  it('should get deep values', () => {
    const state = {
      foo: {
        bar: ['baz', {dog: 42}],
      },
    }
    expect(getIn(state, 'foo.bar[0]')).toBe('baz')
    expect(getIn(state, 'foo.bar[1].dog')).toBe(42)
  })

  it('should get a value nested 1 level', () => {
    expect(getIn({foo: {bar: 42}}, 'foo.bar')).toBe(42)
  })

  it('should get a value nested 2 levels', () => {
    expect(getIn({foo: {bar: {baz: 42}}}, 'foo.bar.baz')).toBe(42)
  })

  it('should get a value nested 3 levels', () => {
    expect(
      getIn({foo: {bar: {baz: {yolanda: 42}}}}, 'foo.bar.baz.yolanda')
    ).toBe(42)
  })

  it('should return undefined if the requested level does not exist', () => {
    expect(getIn({}, 'foo')).toBe(undefined)
    expect(getIn({}, 'foo.bar')).toBe(undefined)
    expect(getIn({}, 'foo.bar.baz')).toBe(undefined)
    expect(getIn({}, 'foo.bar.baz.yolanda')).toBe(undefined)
  })

  it('should return undefined for invalid/empty path', () => {
    expect(getIn({foo: 42}, undefined)).toBe(undefined)
    expect(getIn({foo: 42}, null)).toBe(undefined)
    expect(getIn({foo: 42}, '')).toBe(undefined)
  })

  it('should get string keys on arrays', () => {
    const array = [1, 2, 3]
    array.stringKey = 'hello'
    const state = {
      foo: {
        bar: array,
      },
    }
    expect(getIn(state, 'foo.bar[0]')).toBe(1)
    expect(getIn(state, 'foo.bar[1]')).toBe(2)
    expect(getIn(state, 'foo.bar[2]')).toBe(3)
    expect(getIn(state, 'foo.bar.stringKey')).toBe('hello')
  })
})
