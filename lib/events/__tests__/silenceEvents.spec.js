'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _silenceEvents = require('../silenceEvents');

var _silenceEvents2 = _interopRequireDefault(_silenceEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('silenceEvents', function () {
  it('should return a function', function () {
    (0, _expect2.default)((0, _silenceEvents2.default)()).toExist().toBeA('function');
  });

  it('should return pass all args if first arg is not event', function () {
    var spy = (0, _expect.createSpy)();
    var silenced = (0, _silenceEvents2.default)(spy);

    silenced(1, 2, 3);
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith(1, 2, 3);
    spy.restore();

    silenced('foo', 'bar');
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'bar');
    spy.restore();

    silenced({ value: 10 }, false);
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith({ value: 10 }, false);
    spy.restore();
  });

  it('should return pass other args if first arg is event', function () {
    var spy = (0, _expect.createSpy)();
    var silenced = (0, _silenceEvents2.default)(spy);
    var event = {
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      }
    };

    silenced(event, 1, 2, 3);
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith(1, 2, 3);
    spy.restore();

    silenced(event, 'foo', 'bar');
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'bar');
    spy.restore();

    silenced(event, { value: 10 }, false);
    (0, _expect2.default)(spy).toHaveBeenCalled().toHaveBeenCalledWith({ value: 10 }, false);
    spy.restore();
  });

  it('should silence event', function () {
    var spy = (0, _expect.createSpy)();
    var preventDefault = (0, _expect.createSpy)();
    var stopPropagation = (0, _expect.createSpy)();
    var event = {
      preventDefault: preventDefault,
      stopPropagation: stopPropagation
    };

    (0, _silenceEvents2.default)(spy)(event);
    (0, _expect2.default)(preventDefault).toHaveBeenCalled();
    (0, _expect2.default)(stopPropagation).toNotHaveBeenCalled();
    (0, _expect2.default)(spy).toHaveBeenCalled();
  });
});