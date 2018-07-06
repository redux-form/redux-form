'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _isValid = require('../isValid');

var _isValid2 = _interopRequireDefault(_isValid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('isValid', function () {

  it('should return true if the value is falsy', function () {
    (0, _expect2.default)((0, _isValid2.default)(undefined)).toBe(true);
    (0, _expect2.default)((0, _isValid2.default)(null)).toBe(true);
    (0, _expect2.default)((0, _isValid2.default)(false)).toBe(true);
  });

  it('should return false if the value is truthy', function () {
    (0, _expect2.default)((0, _isValid2.default)('error')).toBe(false);
    (0, _expect2.default)((0, _isValid2.default)(true)).toBe(false);
  });

  it('should return true if the value is an array of falsy values', function () {
    (0, _expect2.default)((0, _isValid2.default)([undefined, null, false])).toBe(true);
  });

  it('should return true if the value is an empty array', function () {
    (0, _expect2.default)((0, _isValid2.default)([])).toBe(true);
  });

  it('should return false if the value is an array with one truthy value', function () {
    (0, _expect2.default)((0, _isValid2.default)([undefined, 'error', undefined])).toBe(false);
  });

  it('should return true if the value is an empty object', function () {
    (0, _expect2.default)((0, _isValid2.default)({})).toBe(true);
  });

  it('should return true if the value is an object with a falsy value', function () {
    (0, _expect2.default)((0, _isValid2.default)({ name: undefined })).toBe(true);
    (0, _expect2.default)((0, _isValid2.default)({ name: null })).toBe(true);
    (0, _expect2.default)((0, _isValid2.default)({ name: false })).toBe(true);
    (0, _expect2.default)((0, _isValid2.default)({ name: '' })).toBe(true);
  });

  it('should return false if the value is an object with a value', function () {
    (0, _expect2.default)((0, _isValid2.default)({ name: 'error' })).toBe(false);
  });
});