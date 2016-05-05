import deleteWithPath from '../deleteWithPath'
import { fromJS } from 'immutable'
import expectations from '../expectations'
import addExpectations from '../../../__tests__/addExpectations'

describe('structure.immutable.deleteWithPath', () => {
  const expect = addExpectations(expectations)

  it('should do nothing with empty state', () => {
    expect(deleteWithPath(undefined, 'dog')).toNotExist()
  })

  it('should not return state if path not found', () => {
    const state = fromJS({ foo: 'bar' })
    expect(deleteWithPath(state, /dog/)).toBe(state)
    expect(deleteWithPath(state, /cat\.rat/)).toBe(state)
  })

  it('should delete shallow keys without mutating state', () => {
    const state = fromJS({ foo: 'bar', dog: 'fido' })
    expect(deleteWithPath(state, /foo/))
      .toNotBe(state)
      .toEqualMap({ dog: 'fido' })
    expect(deleteWithPath(state, /dog/))
      .toNotBe(state)
      .toEqualMap({ foo: 'bar' })
  })

  it('should delete deep keys without mutating state', () => {
    const state = fromJS({
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
    })

    const result1 = deleteWithPath(state, /foo\.bar\[0\]/)
    expect(result1)
      .toNotBe(state)
      .toEqualMap({
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
    expect(result1.get('foo')).toNotBe(state.get('foo'))
    expect(result1.get('foo').get('bar')).toNotBe(state.get('foo').get('bar'))
    expect(result1.get('foo').get('bar').count()).toBe(1)
    expect(result1.get('foo').get('bar').get(0)).toBe(state.get('foo').get('bar').get(1))
    expect(result1.get('cat')).toBe(state.get('cat'))

    const result2 = deleteWithPath(state, /.+bar\[1\]\.dog/)
    expect(result2)
      .toNotBe(state)
      .toEqualMap({
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
    expect(result2.get('foo')).toNotBe(state.get('foo'))
    expect(result2.get('foo').get('bar')).toNotBe(state.get('foo').get('bar'))
    expect(result2.get('foo').get('bar').get(0)).toBe(state.get('foo').get('bar').get(0))
    expect(result2.get('foo').get('bar').get(1)).toNotBe(state.get('foo').get('bar').get(1))
    expect(result2.get('cat')).toBe(state.get('cat'))

    const result3 = deleteWithPath(state, /.+\.dog$/)
    expect(result3)
      .toNotBe(state)
      .toEqualMap({
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
    expect(result3.get('foo')).toNotBe(state.get('foo'))
    expect(result3.get('foo').get('bar')).toNotBe(state.get('foo').get('bar'))
    expect(result3.get('foo').get('bar').get(0)).toBe(state.get('foo').get('bar').get(0))
    expect(result3.get('foo').get('bar').get(1)).toNotBe(state.get('foo').get('bar').get(1))
    expect(result3.get('cat')).toNotBe(state.get('cat'))
    expect(result3.get('cat').get('bar')).toBe(state.get('cat').get('bar'))

    const result4 = deleteWithPath(state, /.+\.bar$/)
    expect(result4)
      .toNotBe(state)
      .toEqualMap({
        foo: {},
        cat: {
          dog: true
        }
      })
    expect(result4.get('foo')).toNotBe(state.get('foo'))
    expect(result4.get('cat')).toNotBe(state.get('cat'))
    expect(result4.get('cat').get('dog')).toBe(state.get('cat').get('dog'))
  })
})

