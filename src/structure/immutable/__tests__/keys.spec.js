import expect from 'expect'
import {is, fromJS, Map, List} from 'immutable'
import keys from '../keys'

const expectEqual = (a, b) => expect(is(a, b)).toBe(true)

describe('structure.immutable.keys', () => {
  it('should return empty List if state is undefined', () => {
    expectEqual(keys(undefined), List())
  })

  it('should return empty List if no keys', () => {
    expectEqual(keys(Map()), List())
  })

  it('should return keys', () => {
    expectEqual(
      keys(
        fromJS({
          a: 1,
          b: 2,
          c: 3
        })
      ),
      List(['a', 'b', 'c'])
    )
  })
})
