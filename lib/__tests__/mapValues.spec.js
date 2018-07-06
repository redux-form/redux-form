'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _mapValues = require('../mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('mapValues', function () {
  it('should return undefined when given undefined', function () {
    (0, _expect2.default)((0, _mapValues2.default)(undefined, function () {
      return null;
    })).toBe(undefined);
  });

  it('should return null when given null', function () {
    (0, _expect2.default)((0, _mapValues2.default)(null, function () {
      return null;
    })).toBe(null);
  });

  it('should call a function on each value', function () {
    (0, _expect2.default)((0, _mapValues2.default)({
      a: 1,
      b: 2,
      c: 3,
      d: 4
    }, function (value) {
      return value * 2;
    })).toBeA('object').toEqual({
      a: 2,
      b: 4,
      c: 6,
      d: 8
    });
  });
});