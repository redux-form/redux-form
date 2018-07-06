'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _isEvent = require('../isEvent');

var _isEvent2 = _interopRequireDefault(_isEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('isEvent', function () {
  it('should return false if event is undefined', function () {
    (0, _expect2.default)((0, _isEvent2.default)()).toBe(false);
  });

  it('should return false if event is null', function () {
    (0, _expect2.default)((0, _isEvent2.default)(null)).toBe(false);
  });

  it('should return false if event is not an object', function () {
    (0, _expect2.default)((0, _isEvent2.default)(42)).toBe(false);
    (0, _expect2.default)((0, _isEvent2.default)(true)).toBe(false);
    (0, _expect2.default)((0, _isEvent2.default)(false)).toBe(false);
    (0, _expect2.default)((0, _isEvent2.default)('not an event')).toBe(false);
  });

  it('should return false if event has no stopPropagation', function () {
    (0, _expect2.default)((0, _isEvent2.default)({
      preventDefault: function preventDefault() {
        return null;
      }
    })).toBe(false);
  });

  it('should return false if event has no preventDefault', function () {
    (0, _expect2.default)((0, _isEvent2.default)({
      stopPropagation: function stopPropagation() {
        return null;
      }
    })).toBe(false);
  });

  it('should return true if event has stopPropagation, and preventDefault', function () {
    (0, _expect2.default)((0, _isEvent2.default)({
      stopPropagation: function stopPropagation() {
        return null;
      },
      preventDefault: function preventDefault() {
        return null;
      }
    })).toBe(true);
  });
});