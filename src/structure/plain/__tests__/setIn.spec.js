import setIn from '../setIn'

describe('structure.plain.setIn', () => {
  it('should create a map if state is undefined and key is string', () => {
    expect(typeof setIn(undefined, 'dog', 'fido')).toBe('object')
    expect(setIn(undefined, 'dog', 'fido')).toEqual({
      dog: 'fido'
    })
  })

  it('should create an array if state is undefined and key is string', () => {
    expect(setIn(undefined, '[0]', 'fido')).toBeInstanceOf(Array)
    expect(setIn(undefined, '[0]', 'fido')).toEqual(['fido'])
    const result = setIn(undefined, '[1]', 'second')
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result[0]).toBe(undefined)
    expect(result[1]).toBe('second')
  })

  it('should handle nested array paths', () => {
    const result = setIn({}, 'a.b[2][1]', 'success')
    const b = []
    b[2] = []
    b[2][1] = 'success'
    expect(result).toEqual({ a: { b } })
  })

  it('should set and shallow keys without mutating state', () => {
    const state = { foo: 'bar' }
    expect(setIn(state, 'foo', 'baz')).not.toBe(state)

    expect(setIn(state, 'foo', 'baz')).toEqual({
      foo: 'baz'
    })

    expect(setIn(state, 'cat', 'fluffy')).not.toBe(state)

    expect(setIn(state, 'cat', 'fluffy')).toEqual({
      foo: 'bar',
      cat: 'fluffy'
    })

    expect(setIn(state, 'age', 42)).not.toBe(state)

    expect(setIn(state, 'age', 42)).toEqual({
      foo: 'bar',
      age: 42
    })
  })

  it('should set and deep keys without mutating state', () => {
    const state = {
      foo: {
        bar: ['baz', { dog: 42 }]
      }
    }
    const result1 = setIn(state, 'tv.best.canines[0]', 'scooby')
    expect(result1).not.toBe(state)

    expect(result1).toEqual({
      foo: {
        bar: [
          'baz',
          {
            dog: 42
          }
        ]
      },

      tv: {
        best: {
          canines: ['scooby']
        }
      }
    })

    expect(result1.foo).toBe(state.foo)

    const result2 = setIn(state, 'foo.bar[0]', 'cat')
    expect(result2).not.toBe(state)

    expect(result2).toEqual({
      foo: {
        bar: [
          'cat',
          {
            dog: 42
          }
        ]
      }
    })

    expect(result2.foo).not.toBe(state.foo)
    expect(result2.foo.bar).not.toBe(state.foo.bar)
    expect(result2.foo.bar[1]).toBe(state.foo.bar[1])

    const result3 = setIn(state, 'foo.bar[1].dog', 7)
    expect(result3).not.toBe(state)

    expect(result3).toEqual({
      foo: {
        bar: [
          'baz',
          {
            dog: 7
          }
        ]
      }
    })

    expect(result3.foo).not.toBe(state.foo)
    expect(result3.foo.bar).not.toBe(state.foo.bar)
    expect(result3.foo.bar[0]).toBe(state.foo.bar[0])
    expect(result3.foo.bar[1]).not.toBe(state.foo.bar[1])
  })
})
