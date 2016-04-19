import expect from 'expect'
import deleteWithPath from '../deleteWithPath'

describe('structure.plain.deleteWithPath', () => {
  it('should not return state if path not found', () => {
    const state = { foo: 'bar' }
    expect(deleteWithPath(state, /dog/)).toBe(state)
    expect(deleteWithPath(state, /cat\.rat/)).toBe(state)
  })

  it('should delete shallow keys without mutating state', () => {
    const state = { foo: 'bar', dog: 'fido' }
    expect(deleteWithPath(state, /foo/))
      .toNotBe(state)
      .toEqual({ dog: 'fido' })
    expect(deleteWithPath(state, /dog/))
      .toNotBe(state)
      .toEqual({ foo: 'bar' })
  })

  it('should delete deep keys without mutating state', () => {
    const state = {
      foo: {
        bar: [
          'baz',
          { dog: 42 }
        ]
      },
      cat: {
        bar: 43,
        dog: true
      }
    }

    const result1 = deleteWithPath(state, /foo\.bar\[0\]/)
    expect(result1)
      .toNotBe(state)
      .toEqual({
        foo: {
          bar: [
            { dog: 42 }
          ]
        },
        cat: {
          bar: 43,
          dog: true
        }
      })
    expect(result1.foo).toNotBe(state.foo)
    expect(result1.foo.bar).toNotBe(state.foo.bar)
    expect(result1.foo.bar.length).toBe(1)
    expect(result1.foo.bar[ 0 ]).toBe(state.foo.bar[ 1 ])
    expect(result1.cat).toBe(state.cat)

    const result2 = deleteWithPath(state, /.+bar\[1\]\.dog/)
    expect(result2)
      .toNotBe(state)
      .toEqual({
        foo: {
          bar: [
            'baz',
            {}
          ]
        },
        cat: {
          bar: 43,
          dog: true
        }
      })
    expect(result2.foo).toNotBe(state.foo)
    expect(result2.foo.bar).toNotBe(state.foo.bar)
    expect(result2.foo.bar[ 0 ]).toBe(state.foo.bar[ 0 ])
    expect(result2.foo.bar[ 1 ]).toNotBe(state.foo.bar[ 1 ])
    expect(result2.cat).toBe(state.cat)

    const result3 = deleteWithPath(state, /.+\.dog$/)
    expect(result3)
      .toNotBe(state)
      .toEqual({
        foo: {
          bar: [
            'baz',
            {}
          ]
        },
        cat: {
          bar: 43
        }
      })
    expect(result3.foo).toNotBe(state.foo)
    expect(result3.foo.bar).toNotBe(state.foo.bar)
    expect(result3.foo.bar[ 0 ]).toBe(state.foo.bar[ 0 ])
    expect(result3.foo.bar[ 1 ]).toNotBe(state.foo.bar[ 1 ])
    expect(result3.cat).toNotBe(state.cat)
    expect(result3.cat.bar).toBe(state.cat.bar)

    const result4 = deleteWithPath(state, /.+\.bar$/)
    expect(result4)
      .toNotBe(state)
      .toEqual({
        foo: {},
        cat: {
          dog: true
        }
      })
    expect(result4.foo).toNotBe(state.foo)
    expect(result4.cat).toNotBe(state.cat)
    expect(result4.cat.dog).toBe(state.cat.dog)
  })
})

