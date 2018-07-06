'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _wrapMapDispatchToProps = require('../wrapMapDispatchToProps');

var _wrapMapDispatchToProps2 = _interopRequireDefault(_wrapMapDispatchToProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createRestorableSpy = function createRestorableSpy() {
  return (0, _expect.createSpy)(function () {
    return null;
  }, function resetCalls() {
    // i'm not sure why expect doesn't do this by default
    this.calls = [];
  });
};

describe('wrapMapDispatchToProps', function () {
  it('should bind action creators if no mapDispatchToProps given', function () {
    var actionCreators = {
      a: (0, _expect.createSpy)(),
      b: (0, _expect.createSpy)()
    };
    var result = (0, _wrapMapDispatchToProps2.default)(undefined, actionCreators);
    (0, _expect2.default)(result).toBeA('function');
    (0, _expect2.default)(result.length).toBe(1);
    var dispatch = createRestorableSpy();
    var mapped = result(dispatch);
    (0, _expect2.default)(mapped).toBeA('object');
    (0, _expect2.default)(mapped.a).toBeA('function');
    (0, _expect2.default)(mapped.b).toBeA('function');

    mapped.a('foo');
    (0, _expect2.default)(actionCreators.a).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    (0, _expect2.default)(actionCreators.b).toHaveBeenCalled();
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
  });

  it('should bind action creators if object mapDispatchToProps given', function () {
    var actionCreators = {
      a: (0, _expect.createSpy)(),
      b: (0, _expect.createSpy)()
    };
    var mapDispatchToProps = {
      c: (0, _expect.createSpy)(),
      d: (0, _expect.createSpy)()
    };
    var result = (0, _wrapMapDispatchToProps2.default)(mapDispatchToProps, actionCreators);
    (0, _expect2.default)(result).toBeA('function');
    (0, _expect2.default)(result.length).toBe(1);
    var dispatch = createRestorableSpy();
    var mapped = result(dispatch);
    (0, _expect2.default)(mapped).toBeA('object');
    (0, _expect2.default)(mapped.a).toBeA('function');
    (0, _expect2.default)(mapped.b).toBeA('function');
    (0, _expect2.default)(mapped.c).toBeA('function');
    (0, _expect2.default)(mapped.d).toBeA('function');

    mapped.a('foo');
    (0, _expect2.default)(actionCreators.a).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    (0, _expect2.default)(actionCreators.b).toHaveBeenCalled();
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.c('bar');
    (0, _expect2.default)(mapDispatchToProps.c).toHaveBeenCalled().toHaveBeenCalledWith('bar');
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.d();
    (0, _expect2.default)(mapDispatchToProps.d).toHaveBeenCalled();
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
  });

  it('should call mapDispatchToProps when one-param function given', function () {
    var actionCreators = {
      a: (0, _expect.createSpy)(),
      b: (0, _expect.createSpy)()
    };
    var mapDispatchToPropsSpy = (0, _expect.createSpy)().andReturn({ c: 42, d: true });
    var mapDispatchToProps = function mapDispatchToProps(dispatch) {
      return mapDispatchToPropsSpy(dispatch);
    };
    (0, _expect2.default)(mapDispatchToProps.length).toBe(1);

    var result = (0, _wrapMapDispatchToProps2.default)(mapDispatchToProps, actionCreators);
    (0, _expect2.default)(result).toBeA('function');
    (0, _expect2.default)(result.length).toBe(1);
    var dispatch = createRestorableSpy();
    var mapped = result(dispatch);
    (0, _expect2.default)(mapDispatchToPropsSpy).toHaveBeenCalled().toHaveBeenCalledWith(dispatch);

    (0, _expect2.default)(mapped).toBeA('object');
    (0, _expect2.default)(mapped.a).toBeA('function');
    (0, _expect2.default)(mapped.b).toBeA('function');
    (0, _expect2.default)(mapped.c).toBe(42);
    (0, _expect2.default)(mapped.d).toBe(true);

    mapped.a('foo');
    (0, _expect2.default)(actionCreators.a).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    (0, _expect2.default)(actionCreators.b).toHaveBeenCalled();
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
  });

  it('should call mapDispatchToProps when two-param function given', function () {
    var actionCreators = {
      a: (0, _expect.createSpy)(),
      b: (0, _expect.createSpy)()
    };
    var mapDispatchToPropsSpy = (0, _expect.createSpy)().andReturn({ c: 42, d: true });
    var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
      return mapDispatchToPropsSpy(dispatch, ownProps);
    };
    (0, _expect2.default)(mapDispatchToProps.length).toBe(2);

    var result = (0, _wrapMapDispatchToProps2.default)(mapDispatchToProps, actionCreators);
    (0, _expect2.default)(result).toBeA('function');
    (0, _expect2.default)(result.length).toBe(2);
    var dispatch = createRestorableSpy();
    var mapped = result(dispatch, 75);
    (0, _expect2.default)(mapDispatchToPropsSpy).toHaveBeenCalled().toHaveBeenCalledWith(dispatch, 75);

    (0, _expect2.default)(mapped).toBeA('object');
    (0, _expect2.default)(mapped.a).toBeA('function');
    (0, _expect2.default)(mapped.b).toBeA('function');
    (0, _expect2.default)(mapped.c).toBe(42);
    (0, _expect2.default)(mapped.d).toBe(true);

    mapped.a('foo');
    (0, _expect2.default)(actionCreators.a).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    (0, _expect2.default)(actionCreators.b).toHaveBeenCalled();
    (0, _expect2.default)(dispatch).toHaveBeenCalled();
  });
});