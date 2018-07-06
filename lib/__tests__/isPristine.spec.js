'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _isPristine = require('../isPristine');

var _isPristine2 = _interopRequireDefault(_isPristine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tryBothWays = function tryBothWays(aValue, bValue, result) {
  (0, _expect2.default)((0, _isPristine2.default)(aValue, bValue)).toBe(result);
  (0, _expect2.default)((0, _isPristine2.default)(bValue, aValue)).toBe(result);
};

describe('isPristine', function () {
  it('should return true if the values are ===', function () {
    var aValue = { foo: 'bar' };
    var bValue = ['foo', 'baz'];
    var cValue = 7;
    (0, _expect2.default)((0, _isPristine2.default)(aValue, aValue)).toBe(true);
    (0, _expect2.default)((0, _isPristine2.default)(bValue, bValue)).toBe(true);
    (0, _expect2.default)((0, _isPristine2.default)(cValue, cValue)).toBe(true);
  });

  it('should return false if one value is an object and the other is not', function () {
    tryBothWays({}, 3, false);
    tryBothWays({}, 'foo', false);
    tryBothWays({}, undefined, false);
    tryBothWays({}, null, false);
  });

  it('should return true when comparing null and undefined and empty string', function () {
    tryBothWays('', null, true);
    tryBothWays(undefined, null, true);
    tryBothWays(undefined, '', true);
  });

  it('should return false when key values are different types', function () {
    tryBothWays({ foo: null }, { foo: 'bar' }, false);
    tryBothWays({ foo: undefined }, { foo: 'bar' }, false);
    tryBothWays({ foo: 69 }, { foo: 'bar' }, false);
  });

  it('should return false when key values are different', function () {
    tryBothWays({ foo: 'bar' }, { foo: 'baz' }, false);
    tryBothWays({ foo: 7, bar: 8 }, { foo: 7, bar: 9 }, false);
    var date1 = new Date();
    var date2 = new Date(date1.getTime() + 1);
    tryBothWays({ date: date1 }, { date: date2 }, false);
  });

  it('should return false when the number of keys is different', function () {
    tryBothWays({ foo: 'bar' }, {}, false);
    tryBothWays([1], [1, 2], false);
  });

  it('should return true when matching key values are null, undefined, or empty string', function () {
    tryBothWays({ foo: '' }, { foo: null }, true);
    tryBothWays({ foo: '' }, { foo: undefined }, true);
    tryBothWays({ foo: null }, { foo: undefined }, true);
  });

  it('should return false when comparing false to other falsy values', function () {
    tryBothWays(false, null, false);
    tryBothWays(false, undefined, false);
    tryBothWays(false, '', false);
  });

  it('should return false when number of keys is different', function () {
    tryBothWays({ foo: 'bar' }, {}, false);
    tryBothWays([1], [1, 2], false);
  });

  it('should return true when key values are equal', function () {
    var date = new Date();
    tryBothWays({ foo: 'bar', when: date }, { foo: 'bar', when: date }, true);
    tryBothWays({ foo: 7, bar: 9, when: date }, { foo: 7, bar: 9, when: date }, true);
  });
});