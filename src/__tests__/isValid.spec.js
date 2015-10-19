import expect from 'expect';
import isValid from '../isValid';

describe('isValid', () => {

  it('should return true if the value is falsy', () => {
    expect(isValid(undefined)).toBe(true);
    expect(isValid(null)).toBe(true);
    expect(isValid(false)).toBe(true);
  });

  it('should return false if the value is truthy', () => {
    expect(isValid({})).toBe(false);
    expect(isValid('error')).toBe(false);
    expect(isValid(true)).toBe(false);
  });

  it('should return true if the value is an array of falsy values', () => {
    expect(isValid([undefined, null, false])).toBe(true);
  });

  it('should return true if the value is an empty array', () => {
    expect(isValid([])).toBe(true);
  });

  it('should return false if the value is an array with one truthy value', () => {
    expect(isValid([undefined, 'error', undefined])).toBe(false);
  });

});
