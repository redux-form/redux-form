import expect from 'expect';
import isPristine from '../isPristine';

const tryBothWays = (aValue, bValue, result) => {
  expect(isPristine(aValue, bValue)).toBe(result);
  expect(isPristine(bValue, aValue)).toBe(result);
};

describe('isPristine', () => {
  it('should return true if the values are ===', () => {
    const aValue = {foo: 'bar'};
    const bValue = ['foo', 'baz'];
    const cValue = 7;
    expect(isPristine(aValue, aValue)).toBe(true);
    expect(isPristine(bValue, bValue)).toBe(true);
    expect(isPristine(cValue, cValue)).toBe(true);
  });

  it('should return false if one value is an object and the other is not', () => {
    tryBothWays({}, 3, false);
    tryBothWays({}, 'foo', false);
    tryBothWays({}, undefined, false);
    tryBothWays({}, null, false);
  });

  it('should return true when comparing null and undefined and empty string', () => {
    tryBothWays('', null, true);
    tryBothWays(undefined, null, true);
    tryBothWays(undefined, '', true);
  });

  it('should return false when key values are different types', () => {
    tryBothWays({foo: null}, {foo: 'bar'}, false);
    tryBothWays({foo: undefined}, {foo: 'bar'}, false);
    tryBothWays({foo: 69}, {foo: 'bar'}, false);
  });

  it('should return false when key values are different', () => {
    tryBothWays({foo: 'bar'}, {foo: 'baz'}, false);
    tryBothWays({foo: 7, bar: 8}, {foo: 7, bar: 9}, false);
  });

  it('should return true when matching key values are null, undefined, or empty string', () => {
    tryBothWays({foo: ''}, {foo: null}, true);
    tryBothWays({foo: ''}, {foo: undefined}, true);
    tryBothWays({foo: null}, {foo: undefined}, true);
  });

  it('should return true when key values are equal', () => {
    tryBothWays({foo: 'bar'}, {foo: 'bar'}, true);
    tryBothWays({foo: 7, bar: 9}, {foo: 7, bar: 9}, true);
  });

});
