import { fromJS, List } from 'immutable'
import splice from '../splice'

describe('structure.immutable.splice', () => {
  const testInsertWithValue = value => {
    it('should insert even when initial array is undefined', () => {
      // really goes to index 0
      expect(splice(undefined, 2, 0, value)).toBeInstanceOf(List);

      // really goes to index 0
      expect(splice(undefined, 2, 0, value)).toEqual(fromJS([,, value]));
    })

    it('should insert at start', () => {
      expect(splice(fromJS(['b', 'c', 'd']), 0, 0, value)).toBeInstanceOf(List);
      expect(splice(fromJS(['b', 'c', 'd']), 0, 0, value)).toEqual(fromJS([value, 'b', 'c', 'd']));
    })

    it('should insert at end', () => {
      expect(splice(fromJS(['a', 'b', 'c']), 3, 0, value)).toBeInstanceOf(List);
      expect(splice(fromJS(['a', 'b', 'c']), 3, 0, value)).toEqual(fromJS(['a', 'b', 'c', value]));
    })

    it('should insert in middle', () => {
      expect(splice(fromJS(['a', 'b', 'd']), 2, 0, value)).toBeInstanceOf(List);
      expect(splice(fromJS(['a', 'b', 'd']), 2, 0, value)).toEqual(fromJS(['a', 'b', value, 'd']));
    })

    it('should insert in out of range', () => {
      expect(splice(fromJS(['a', 'b', 'c']), 5, 0, value)).toBeInstanceOf(List);
      expect(splice(fromJS(['a', 'b', 'c']), 5, 0, value)).toEqual(fromJS(['a', 'b', 'c',,, value]));
    })
  }

  testInsertWithValue('value')
  testInsertWithValue(undefined)

  it('should return empty array when removing and initial array is undefined', () => {
    expect(splice(undefined, 2, 1)).toBeInstanceOf(List);
    expect(splice(undefined, 2, 1)).toEqual(fromJS([]));
  })

  it('should remove at start', () => {
    expect(splice(fromJS(['a', 'b', 'c', 'd']), 0, 1)).toBeInstanceOf(List);
    expect(splice(fromJS(['a', 'b', 'c', 'd']), 0, 1)).toEqual(fromJS(['b', 'c', 'd']));
  })

  it('should remove in the middle then insert in that position', () => {
    expect(splice(fromJS(['a', 'b', 'c', 'd']), 1, 1, 'e')).toBeInstanceOf(List);
    expect(splice(fromJS(['a', 'b', 'c', 'd']), 1, 1, 'e')).toEqual(fromJS(['a', 'e', 'c', 'd']));
  })

  it('should remove at end', () => {
    expect(splice(fromJS(['a', 'b', 'c', 'd']), 3, 1)).toBeInstanceOf(List);
    expect(splice(fromJS(['a', 'b', 'c', 'd']), 3, 1)).toEqual(fromJS(['a', 'b', 'c']));
  })

  it('should remove in middle', () => {
    expect(splice(fromJS(['a', 'b', 'c', 'd']), 2, 1)).toBeInstanceOf(List);
    expect(splice(fromJS(['a', 'b', 'c', 'd']), 2, 1)).toEqual(fromJS(['a', 'b', 'd']));
  })
})
