import expect from 'expect'
import setIn from '../setIn'

describe('structure.plain.setIn', () => {
  it('should create a map if state is undefined and key is string', () => {
    expect(setIn(undefined, 'dog', 'fido'))
      .toBeA('object')
      .toEqual({dog: 'fido'})
  })

  it('should create an array if state is undefined and key is string', () => {
    expect(setIn(undefined, '[0]', 'fido')).toBeA(Array).toEqual(['fido'])
    const result = setIn(undefined, '[1]', 'second')
    expect(result).toBeA(Array)
    expect(result.length).toBe(2)
    expect(result[0]).toBe(undefined)
    expect(result[1]).toBe('second')
  })

  it('should handle nested array paths', () => {
    const result = setIn({}, 'a.b[2][1]', 'success')
    const b = []
    b[2] = []
    b[2][1] = 'success'
    expect(result).toEqual({a: {b}})
  })

  it('should set and shallow keys without mutating state', () => {
    const state = {foo: 'bar'}
    expect(setIn(state, 'foo', 'baz')).toNotBe(state).toEqual({foo: 'baz'})
    expect(setIn(state, 'cat', 'fluffy'))
      .toNotBe(state)
      .toEqual({foo: 'bar', cat: 'fluffy'})
    expect(setIn(state, 'age', 42))
      .toNotBe(state)
      .toEqual({foo: 'bar', age: 42})
  })

  it('should set and deep keys without mutating state', () => {
    const state = {
      foo: {
        bar: ['baz', {dog: 42}],
      },
    }
    const result1 = setIn(state, 'tv.best.canines[0]', 'scooby')
    expect(result1).toNotBe(state).toEqual({
      foo: {
        bar: ['baz', {dog: 42}],
      },
      tv: {
        best: {
          canines: ['scooby'],
        },
      },
    })
    expect(result1.foo).toBe(state.foo)

    const result2 = setIn(state, 'foo.bar[0]', 'cat')
    expect(result2).toNotBe(state).toEqual({
      foo: {
        bar: ['cat', {dog: 42}],
      },
    })
    expect(result2.foo).toNotBe(state.foo)
    expect(result2.foo.bar).toNotBe(state.foo.bar)
    expect(result2.foo.bar[1]).toBe(state.foo.bar[1])

    const result3 = setIn(state, 'foo.bar[1].dog', 7)
    expect(result3).toNotBe(state).toEqual({
      foo: {
        bar: ['baz', {dog: 7}],
      },
    })
    expect(result3.foo).toNotBe(state.foo)
    expect(result3.foo.bar).toNotBe(state.foo.bar)
    expect(result3.foo.bar[0]).toBe(state.foo.bar[0])
    expect(result3.foo.bar[1]).toNotBe(state.foo.bar[1])
  })
})
