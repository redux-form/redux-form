import expect from 'expect';
import { ADD_ARRAY_VALUE, BLUR, CHANGE, FOCUS, INITIALIZE, REMOVE_ARRAY_VALUE, RESET, START_ASYNC_VALIDATION,
  START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, SWAP_ARRAY_VALUES, TOUCH, UNTOUCH, DESTROY } from '../actionTypes';
import {addArrayValue, blur, change, destroy, focus, initialize, removeArrayValue, reset, startAsyncValidation, startSubmit,
  stopAsyncValidation, stopSubmit, swapArrayValues, touch, untouch} from '../actions';

describe('actions', () => {
  it('should create add array value action', () => {
    expect(addArrayValue('foo', undefined, 1)).toEqual({
      type: ADD_ARRAY_VALUE,
      path: 'foo',
      index: 1,
      value: undefined,
      fields: undefined
    });
    expect(addArrayValue('bar.baz')).toEqual({
      type: ADD_ARRAY_VALUE,
      path: 'bar.baz',
      index: undefined,
      value: undefined,
      fields: undefined
    });
    expect(addArrayValue('bar.baz', 'foo', 2)).toEqual({
      type: ADD_ARRAY_VALUE,
      path: 'bar.baz',
      index: 2,
      value: 'foo',
      fields: undefined
    });
    expect(addArrayValue('bar.baz', 'foo', 2, ['x', 'y'])).toEqual({
      type: ADD_ARRAY_VALUE,
      path: 'bar.baz',
      index: 2,
      value: 'foo',
      fields: [ 'x', 'y' ]
    });
  });

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
    const fields = ['a', 'c'];
    expect(initialize(data, fields)).toEqual({type: INITIALIZE, data, fields, overwriteValues: true});
    expect(initialize(data, fields)).toEqual({type: INITIALIZE, data, fields, overwriteValues: true});
    expect(initialize(data, fields, false)).toEqual({type: INITIALIZE, data, fields, overwriteValues: false});
    expect(initialize(data, fields, false)).toEqual({type: INITIALIZE, data, fields, overwriteValues: false});
  });

  it('should throw an error if initialize is not given a fields array', () => {
    expect(() => initialize({a: 1, b: 2}, undefined)).toThrow(/must provide fields array/);
    expect(() => initialize({a: 1, b: 2}, 'not an array')).toThrow(/must provide fields array/);
    expect(() => initialize({a: 1, b: 2}, {also: 'not an array'})).toThrow(/must provide fields array/);
  });

  it('should create remove array value action', () => {
    expect(removeArrayValue('foo', 3)).toEqual({
      type: REMOVE_ARRAY_VALUE,
      path: 'foo',
      index: 3
    });
    expect(removeArrayValue('bar.baz')).toEqual({
      type: REMOVE_ARRAY_VALUE,
      path: 'bar.baz',
      index: undefined
    });
  });

  it('should create reset action', () => {
    expect(reset()).toEqual({type: RESET});
  });

  it('should create destroy action', () => {
    expect(destroy()).toEqual({type: DESTROY});
  });

  it('should create startAsyncValidation action', () => {
    expect(startAsyncValidation('myField')).toEqual({
      type: START_ASYNC_VALIDATION,
      field: 'myField'
    });
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
    expect(stopSubmit()).toEqual({
      type: STOP_SUBMIT,
      errors: undefined
    });
    const errors = {
      foo: 'Foo error',
      bar: 'Error for bar',
    };
    expect(stopSubmit(errors)).toEqual({
      type: STOP_SUBMIT,
      errors
    });
  });

  it('should create swap array value action', () => {
    expect(swapArrayValues('foo', 3, 6)).toEqual({
      type: SWAP_ARRAY_VALUES,
      path: 'foo',
      indexA: 3,
      indexB: 6
    });
    expect(swapArrayValues('foo', 3)).toEqual({
      type: SWAP_ARRAY_VALUES,
      path: 'foo',
      indexA: 3,
      indexB: undefined
    });
    expect(swapArrayValues('bar.baz')).toEqual({
      type: SWAP_ARRAY_VALUES,
      path: 'bar.baz',
      indexA: undefined,
      indexB: undefined
    });
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
