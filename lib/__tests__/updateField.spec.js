'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _updateField = require('../updateField');

var _updateField2 = _interopRequireDefault(_updateField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('updateField', function () {
  it('should return new field object when something changes', function () {
    var field = { value: 'foo' };
    var result = (0, _updateField2.default)(field, { value: 'bar' }, false, undefined);
    (0, _expect2.default)(result).toNotBe(field);
  });

  it('should set value', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, { value: 'foo' }, true, undefined).value).toBe('foo');
    (0, _expect2.default)((0, _updateField2.default)({ value: 'foo' }, { value: 'bar' }, true, undefined).value).toBe('bar');
    (0, _expect2.default)((0, _updateField2.default)({}, { value: 42 }, true, undefined).value).toBe(42);
    (0, _expect2.default)((0, _updateField2.default)({ value: 3 }, { value: 42 }, true, undefined).value).toBe(42);
  });

  it('should set pristine and dirty', function () {
    var result1 = (0, _updateField2.default)({}, { value: 'foo', initial: 'foo' }, false, undefined);
    (0, _expect2.default)(result1.dirty).toBe(false);
    (0, _expect2.default)(result1.pristine).toBe(true);
    var result2 = (0, _updateField2.default)({}, { value: 'foo', initial: 'bar' }, false, undefined);
    (0, _expect2.default)(result2.dirty).toBe(true);
    (0, _expect2.default)(result2.pristine).toBe(false);

    // test that it overwrites existing flags
    var result3 = (0, _updateField2.default)({ dirty: true, pristine: false }, { value: 'foo', initial: 'foo' }, false, undefined);
    (0, _expect2.default)(result3.dirty).toBe(false);
    (0, _expect2.default)(result3.pristine).toBe(true);
    var result4 = (0, _updateField2.default)({ dirty: false, pristine: true }, { value: 'foo', initial: 'bar' }, false, undefined);
    (0, _expect2.default)(result4.dirty).toBe(true);
    (0, _expect2.default)(result4.pristine).toBe(false);
  });

  it('should have no error when no errors', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, {}, false, undefined).error).toBe(undefined);
  });

  it('should set error from sync error', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, {}, false, 'foo').error).toBe('foo');
    (0, _expect2.default)((0, _updateField2.default)({}, {}, false, 'bar').error).toBe('bar');
  });

  it('should set error from submit error', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, { submitError: 'foo' }, false, undefined).error).toBe('foo');
    (0, _expect2.default)((0, _updateField2.default)({}, { submitError: 'bar' }, false, undefined).error).toBe('bar');
  });

  it('should set error from async error', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, { asyncError: 'foo' }, false, undefined).error).toBe('foo');
    (0, _expect2.default)((0, _updateField2.default)({}, { asyncError: 'bar' }, false, undefined).error).toBe('bar');
  });

  it('should prioritize submit error over async error', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, { asyncError: 'fooAsync', submitError: 'fooSubmit' }, false, undefined).error).toBe('fooSubmit');
    (0, _expect2.default)((0, _updateField2.default)({}, { asyncError: 'barAsync', submitError: 'barSubmit' }, false, undefined).error).toBe('barSubmit');
  });

  it('should prioritize sync error over async error', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, { asyncError: 'fooAsync' }, false, 'fooSync').error).toBe('fooSync');
    (0, _expect2.default)((0, _updateField2.default)({}, { asyncError: 'barAsync' }, false, 'barSync').error).toBe('barSync');
  });

  it('should prioritize sync error over submit error', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, { submitError: 'fooSubmit' }, false, 'fooSync').error).toBe('fooSync');
    (0, _expect2.default)((0, _updateField2.default)({}, { submitError: 'barSubmit' }, false, 'barSync').error).toBe('barSync');
  });

  it('should prioritize sync error over submit and async error', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, { asyncError: 'fooAsync', submitError: 'fooSubmit' }, false, 'fooSync').error).toBe('fooSync');
    (0, _expect2.default)((0, _updateField2.default)({}, { asyncError: 'barAsync', submitError: 'barSubmit' }, false, 'barSync').error).toBe('barSync');
  });

  it('should set valid/invalid', function () {
    var result1 = (0, _updateField2.default)({}, {}, false, undefined);
    (0, _expect2.default)(result1.valid).toBe(true);
    (0, _expect2.default)(result1.invalid).toBe(false);
    var result2 = (0, _updateField2.default)({}, {}, false, 'sync error');
    (0, _expect2.default)(result2.valid).toBe(false);
    (0, _expect2.default)(result2.invalid).toBe(true);

    // test that it overwrites existing flags
    var result3 = (0, _updateField2.default)({ valid: false, invalid: true }, {}, false, undefined);
    (0, _expect2.default)(result3.valid).toBe(true);
    (0, _expect2.default)(result3.invalid).toBe(false);
    var result4 = (0, _updateField2.default)({ valid: true, invalid: false }, {}, false, 'sync error');
    (0, _expect2.default)(result4.valid).toBe(false);
    (0, _expect2.default)(result4.invalid).toBe(true);
  });

  it('should set active', function () {
    (0, _expect2.default)((0, _updateField2.default)({}, {}, true, undefined).active).toBe(true);
    (0, _expect2.default)((0, _updateField2.default)({ active: false }, {}, true, undefined).active).toBe(true);
    (0, _expect2.default)((0, _updateField2.default)({}, {}, false, undefined).active).toBe(false);
    (0, _expect2.default)((0, _updateField2.default)({ active: true }, {}, false, undefined).active).toBe(false);
  });

  it('should set touched', function () {
    // init
    (0, _expect2.default)((0, _updateField2.default)({}, { touched: true }, false, undefined).touched).toBe(true);
    (0, _expect2.default)((0, _updateField2.default)({}, { touched: false }, false, undefined).touched).toBe(false);
    (0, _expect2.default)((0, _updateField2.default)({}, {}, false, undefined).touched).toBe(false);
    // update
    (0, _expect2.default)((0, _updateField2.default)({ touched: false }, { touched: true }, false, undefined).touched).toBe(true);
    (0, _expect2.default)((0, _updateField2.default)({ touched: true }, { touched: false }, false, undefined).touched).toBe(false);
    (0, _expect2.default)((0, _updateField2.default)({ touched: true }, {}, false, undefined).touched).toBe(false);
  });

  it('should set visited', function () {
    // init
    (0, _expect2.default)((0, _updateField2.default)({}, { visited: true }, false, undefined).visited).toBe(true);
    (0, _expect2.default)((0, _updateField2.default)({}, { visited: false }, false, undefined).visited).toBe(false);
    (0, _expect2.default)((0, _updateField2.default)({}, {}, false, undefined).visited).toBe(false);
    // update
    (0, _expect2.default)((0, _updateField2.default)({ visited: false }, { visited: true }, false, undefined).visited).toBe(true);
    (0, _expect2.default)((0, _updateField2.default)({ visited: true }, { visited: false }, false, undefined).visited).toBe(false);
    (0, _expect2.default)((0, _updateField2.default)({ visited: true }, {}, false, undefined).visited).toBe(false);
  });

  it('should change initial and default values when initial changes', function () {
    (0, _expect2.default)((0, _updateField2.default)({ initialValue: 1 }, { initial: 2 }, false, undefined).initialValue).toBe(2);
    (0, _expect2.default)((0, _updateField2.default)({ initialValue: 1 }, { initial: undefined }, false, undefined).initialValue).toBe(undefined);
  });
});