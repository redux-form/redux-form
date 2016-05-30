import expect from 'expect';
import {makeFieldValue, isFieldValue} from '../fieldValue';

describe('fieldValue', () => {
  describe('makeFieldValue', () => {
    it('should be okay with non-objects', () => {
      expect(makeFieldValue()).toBe(undefined);
      expect(makeFieldValue(null)).toBe(null);
      expect(makeFieldValue([1, 2])).toEqual([1, 2]);
      expect(makeFieldValue('not an object')).toEqual('not an object');
    });

    it('should return the same object back', () => {
      const someObject = {b: 1};
      expect(makeFieldValue(someObject)).toBe(someObject);
    });

    it('should not affect deep equal', () => {
      const someObject = {b: 1};
      expect(someObject).toEqual({b: 1});
      makeFieldValue(someObject);
      expect(someObject).toEqual({
        b: 1,
        _isFieldValue: true
      });
    });

    it('should set the field value flag', () => {
      const someObject = {b: 1};
      expect(isFieldValue(someObject)).toBe(false);
      makeFieldValue(someObject);
      expect(isFieldValue(someObject)).toBe(true);
    });
  });

  describe('isFieldValue', () => {
    it('should be okay with non-objects', () => {
      expect(isFieldValue()).toBe(false);
      expect(isFieldValue(null)).toBe(false);
      expect(isFieldValue([1, 2])).toBe(false);
      expect(isFieldValue('not an object')).toBe(false);
    });
  });
});
