import expect from 'expect';
import isEvent from '../isEvent';

describe('isEvent', () => {
  it('should return false if event is undefined', () => {
    expect(isEvent()).toBe(false);
  });

  it('should return false if event is null', () => {
    expect(isEvent(null)).toBe(false);
  });

  it('should return false if event is not an object', () => {
    expect(isEvent(42)).toBe(false);
    expect(isEvent(true)).toBe(false);
    expect(isEvent(false)).toBe(false);
    expect(isEvent('not an event')).toBe(false);
  });

  it('should return false if event has no target', () => {
    expect(isEvent({
      stopPropagation: () => null,
      preventDefault: () => null
    })).toBe(false);
  });

  it('should return false if event has no stopPropagation', () => {
    expect(isEvent({
      target: 'foo',
      preventDefault: () => null
    })).toBe(false);
  });

  it('should return false if event has no preventDefault', () => {
    expect(isEvent({
      target: 'foo',
      stopPropagation: () => null
    })).toBe(false);
  });

  it('should return true if event has target, stopPropagation, and preventDefault', () => {
    expect(isEvent({
      target: 'foo',
      stopPropagation: () => null,
      preventDefault: () => null
    })).toBe(true);
  });
});
