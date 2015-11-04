import expect from 'expect';
import normalizeMax from '../normalizeMax';

describe('normalizeMax', () => {
  it('should do nothing when min does not change', () => {
    expect(normalizeMax(undefined, undefined, {min: undefined}, {min: undefined})).toBe(undefined);
    expect(normalizeMax(3, undefined, {min: 4}, {min: 4})).toBe(3);
    expect(normalizeMax('8', undefined, {min: '4'}, {min: '4'})).toBe('8');
    expect(normalizeMax(42, undefined, {}, {})).toBe(42);
  });

  it('should do set max when min changes but and max is undefined', () => {
    expect(normalizeMax(undefined, undefined, {min: '4'}, {min: '3'})).toBe('4');
  });

  it('should do nothing when min changes but is lower than max', () => {
    expect(normalizeMax(3, undefined, {min: 1}, {min: 2})).toBe(3);
    expect(normalizeMax('7', undefined, {min: '5'}, {min: '2'})).toBe('7');
  });

  it('should do raise max when min changes and is higher than max', () => {
    expect(normalizeMax(3, undefined, {min: 4}, {min: 2})).toBe(4);
    expect(normalizeMax('5', undefined, {min: '7'}, {min: '2'})).toBe('7');
  });

});
