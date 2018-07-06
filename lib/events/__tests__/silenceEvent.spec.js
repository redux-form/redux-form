'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _silenceEvent = require('../silenceEvent');

var _silenceEvent2 = _interopRequireDefault(_silenceEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('silenceEvent', function () {
  it('should return false if not an event', function () {
    (0, _expect2.default)((0, _silenceEvent2.default)(undefined)).toBe(false);
    (0, _expect2.default)((0, _silenceEvent2.default)(null)).toBe(false);
    (0, _expect2.default)((0, _silenceEvent2.default)(true)).toBe(false);
    (0, _expect2.default)((0, _silenceEvent2.default)(42)).toBe(false);
    (0, _expect2.default)((0, _silenceEvent2.default)({})).toBe(false);
    (0, _expect2.default)((0, _silenceEvent2.default)([])).toBe(false);
    (0, _expect2.default)((0, _silenceEvent2.default)(function () {
      return null;
    })).toBe(false);
  });

  it('should return true if an event', function () {
    (0, _expect2.default)((0, _silenceEvent2.default)({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      }
    })).toBe(true);
  });

  it('should call preventDefault and stopPropagation', function () {
    var preventDefault = (0, _expect.createSpy)();
    var stopPropagation = (0, _expect.createSpy)();

    (0, _silenceEvent2.default)({
      preventDefault: preventDefault,
      stopPropagation: stopPropagation
    });
    (0, _expect2.default)(preventDefault).toHaveBeenCalled();
    (0, _expect2.default)(stopPropagation).toNotHaveBeenCalled();
  });
});