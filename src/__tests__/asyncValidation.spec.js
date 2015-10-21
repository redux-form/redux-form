import expect, {createSpy} from 'expect';
import isPromise from 'is-promise';
import asyncValidation from '../asyncValidation';

describe('asyncValidation', () => {

  it('should throw an error if fn does not return a promise', () => {
    const fn = () => null;
    const start = () => null;
    const stop = () => null;
    expect(() => asyncValidation(fn, start, stop))
      .toThrow(/promise/);
  });

  it('should return a promise', () => {
    const fn = () => Promise.resolve();
    const start = () => null;
    const stop = () => null;
    expect(isPromise(asyncValidation(fn, start, stop))).toBe(true);
  });

  it('should call start, fn, and stop on promise resolve', () => {
    const fn = createSpy().andReturn(Promise.resolve());
    const start = createSpy();
    const stop = createSpy();
    const promise = asyncValidation(fn, start, stop);
    expect(fn).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
    return promise.then(() => {
      expect(stop).toHaveBeenCalled();
    }, () => {
      expect(false).toBe(true); // should not get into reject branch
    });
  });

  it('should call start, fn, and stop on promise reject', () => {
    const fn = createSpy().andReturn(Promise.reject());
    const start = createSpy();
    const stop = createSpy();
    const promise = asyncValidation(fn, start, stop);
    expect(fn).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
    return promise.then(() => {
      expect(false).toBe(true); // should not get into resolve branch
    }, () => {
      expect(stop).toHaveBeenCalled();
    });
  });
});
