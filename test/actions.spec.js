import expect from 'expect';
import { BLUR, CHANGE, FOCUS, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, TOUCH, UNTOUCH } from '../src/actionTypes';
import {blur, change, focus, initialize, reset, startAsyncValidation, startSubmit,
  stopAsyncValidation, stopSubmit, touch, untouch} from '../src/actions';

describe('actions', () => {
  it('should create blur action', () => {
    expect(blur('foo', 'bar')).toEqual({
      type: BLUR,
      field: 'foo',
      value: 'bar'
    });
    expect(blur('baz', 7)).toEqual({
      type: BLUR,
      field: 'baz',
      value: 7
    });
  });

  it('should create change action', () => {
    expect(change('foo', 'bar')).toEqual({
      type: CHANGE,
      field: 'foo',
      value: 'bar'
    });
    expect(change('baz', 7)).toEqual({
      type: CHANGE,
      field: 'baz',
      value: 7
    });
  });

  it('should create focus action', () => {
    expect(focus('foo')).toEqual({
      type: FOCUS,
      field: 'foo'
    });
  });

  it('should create initialize action', () => {
    const data = {a: 8, c: 9};
    expect(initialize(data)).toEqual({
      type: INITIALIZE,
      data: data
    });
  });

  it('should create reset action', () => {
    expect(reset()).toEqual({type: RESET});
  });

  it('should create startAsyncValidation action', () => {
    expect(startAsyncValidation()).toEqual({type: START_ASYNC_VALIDATION});
  });

  it('should create startSubmit action', () => {
    expect(startSubmit()).toEqual({type: START_SUBMIT});
  });

  it('should create stopAsyncValidation action', () => {
    const errors = {
      foo: 'Foo error',
      bar: 'Error for bar'
    };
    expect(stopAsyncValidation(errors)).toEqual({
      type: STOP_ASYNC_VALIDATION,
      errors
    });
  });

  it('should create stopSubmit action', () => {
    expect(stopSubmit()).toEqual({type: STOP_SUBMIT});
  });

  it('should create touch action', () => {
    expect(touch('foo', 'bar')).toEqual({
      type: TOUCH,
      fields: ['foo', 'bar']
    });
    expect(touch('cat', 'dog', 'pig')).toEqual({
      type: TOUCH,
      fields: ['cat', 'dog', 'pig']
    });
  });

  it('should create untouch action', () => {
    expect(untouch('foo', 'bar')).toEqual({
      type: UNTOUCH,
      fields: ['foo', 'bar']
    });
    expect(untouch('cat', 'dog', 'pig')).toEqual({
      type: UNTOUCH,
      fields: ['cat', 'dog', 'pig']
    });
  });

});
