import expect from 'expect';
import isValid from '../isValid';

describe('isValid', () => {

  it('should return true if the value is falsey', () => {
    const a = undefined;
    const b = false;
    expect(isValid(a)).toBe(true);
    expect(isValid(b)).toBe(true);
  });

  it('should return true if the value is an array of falsey values', () => {
    const a = undefined;
    const b = false;
    expect(isValid([a, b])).toBe(true);
  });

  it('should return true if the value is an empty array', () => {
    expect(isValid([])).toBe(true);
  });

  it('should return false if the value is an array with one truthy value', () => {
    const a = undefined;
    const b = 'Error';
    expect(isValid([a, b, a])).toBe(false);
  });

});
