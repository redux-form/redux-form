import expect from 'expect'
import { fromJS, List } from 'immutable'
import splice from '../splice'

describe('structure.immutable.splice', () => {
  const testInsertWithValue = value => {
    it('should insert even when initial array is undefined', () => {
      expect(splice(undefined, 2, 0, value))  // really goes to index 0
        .toBeA(List)
        .toEqual(fromJS([ , , value ]))  // eslint-disable-line no-sparse-arrays
    })

    it('should insert at start', () => {
      expect(splice(fromJS([ 'b', 'c', 'd' ]), 0, 0, value))
        .toBeA(List)
        .toEqual(fromJS([ value, 'b', 'c', 'd' ]))
    })

    it('should insert at end', () => {
      expect(splice(fromJS([ 'a', 'b', 'c' ]), 3, 0, value))
        .toBeA(List)
        .toEqual(fromJS([ 'a', 'b', 'c', value ]))
    })

    it('should insert in middle', () => {
      expect(splice(fromJS([ 'a', 'b', 'd' ]), 2, 0, value))
        .toBeA(List)
        .toEqual(fromJS([ 'a', 'b', value, 'd' ]))
    })

    it('should insert in out of range', () => {
      expect(splice(fromJS([ 'a', 'b', 'c' ]), 5, 0, value))
        .toBeA(List)
        .toEqual(fromJS([ 'a', 'b', 'c', , , value ]))  // eslint-disable-line no-sparse-arrays
    })
  }

  testInsertWithValue('value')
  testInsertWithValue(undefined)

  it('should return empty array when removing and initial array is undefined', () => {
    expect(splice(undefined, 2, 1))
      .toBeA(List)
      .toEqual(fromJS([]))
  })

  it('should remove at start', () => {
    expect(splice(fromJS([ 'a', 'b', 'c', 'd' ]), 0, 1))
      .toBeA(List)
      .toEqual(fromJS([ 'b', 'c', 'd' ]))
  })

  it('should remove in the middle then insert in that position', () => {
    expect(splice(fromJS([ 'a', 'b', 'c', 'd' ]), 1, 1, 'e'))
      .toBeA(List)
      .toEqual(fromJS([ 'a', 'e', 'c', 'd' ]))
  })

  it('should remove at end', () => {
    expect(splice(fromJS([ 'a', 'b', 'c', 'd' ]), 3, 1))
      .toBeA(List)
      .toEqual(fromJS([ 'a', 'b', 'c' ]))
  })

  it('should remove in middle', () => {
    expect(splice(fromJS([ 'a', 'b', 'c', 'd' ]), 2, 1))
      .toBeA(List)
      .toEqual(fromJS([ 'a', 'b', 'd' ]))
  })
})
