import expect from 'expect'
import deleteIn from '../deleteIn'

describe('structure.plain.deleteIn', () => {
  it('should not return state if path not found', () => {
    const state = {foo: 'bar'}
    expect(deleteIn(state, undefined)).toBe(state)
    expect(deleteIn(state, 'dog')).toBe(state)
    expect(deleteIn(state, 'cat.rat.pig')).toBe(state)
  })

  it('should do nothing if array index out of bounds', () => {
    const state = {
      foo: [
        {
          bar: ['dog'],
        },
      ],
    }
    expect(deleteIn(state, 'foo[2].bar[0]')).toEqual(state)
    expect(deleteIn(state, 'foo[0].bar[2]')).toEqual(state)
  })

  it('should throw exception for non-numerical array indexes', () => {
    const state = {
      foo: ['dog'],
    }
    expect(() => deleteIn(state, 'foo[bar]')).toThrow(/non-numerical index/)
  })

  it('should delete shallow keys without mutating state', () => {
    const state = {foo: 'bar', dog: 'fido'}
    expect(deleteIn(state, 'foo')).toNotBe(state).toEqual({dog: 'fido'})
    expect(deleteIn(state, 'dog')).toNotBe(state).toEqual({foo: 'bar'})
  })

  it('should delete shallow array indexes without mutating state', () => {
    const state = ['the', 'quick', 'brown', 'fox']
    expect(deleteIn(state, 4)).toBe(state) // index not found
    expect(deleteIn(state, 0)).toNotBe(state).toEqual(['quick', 'brown', 'fox'])
    expect(deleteIn(state, 1)).toNotBe(state).toEqual(['the', 'brown', 'fox'])
    expect(deleteIn(state, 2)).toNotBe(state).toEqual(['the', 'quick', 'fox'])
    expect(deleteIn(state, 3)).toNotBe(state).toEqual(['the', 'quick', 'brown'])
  })

  it('should delete deep keys without mutating state', () => {
    const state = {
      foo: {
        bar: ['baz', {dog: 42}],
      },
    }

    const result1 = deleteIn(state, 'foo.bar[0]')
    expect(result1).toNotBe(state).toEqual({
      foo: {
        bar: [{dog: 42}],
      },
    })
    expect(result1.foo).toNotBe(state.foo)
    expect(result1.foo.bar).toNotBe(state.foo.bar)
    expect(result1.foo.bar.length).toBe(1)
    expect(result1.foo.bar[0]).toBe(state.foo.bar[1])

    const result2 = deleteIn(state, 'foo.bar[1].dog')
    expect(result2).toNotBe(state).toEqual({
      foo: {
        bar: ['baz', {}],
      },
    })
    expect(result2.foo).toNotBe(state.foo)
    expect(result2.foo.bar).toNotBe(state.foo.bar)
    expect(result2.foo.bar[0]).toBe(state.foo.bar[0])
    expect(result2.foo.bar[1]).toNotBe(state.foo.bar[1])

    const result3 = deleteIn(state, 'foo.bar')
    expect(result3).toNotBe(state).toEqual({
      foo: {},
    })
    expect(result3.foo).toNotBe(state.foo)
  })

  it("should not mutate deep state if can't find final key", () => {
    const state = {
      foo: {
        bar: [{}],
      },
    }
    const result = deleteIn(state, 'foo.bar[0].dog')
    expect(result).toBe(state).toEqual({
      foo: {
        bar: [{}],
      },
    })
    expect(result.foo).toBe(state.foo)
    expect(result.foo.bar).toBe(state.foo.bar)
    expect(result.foo.bar[0]).toBe(state.foo.bar[0])
  })
})
