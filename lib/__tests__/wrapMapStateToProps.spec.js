'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _wrapMapStateToProps = require('../wrapMapStateToProps');

var _wrapMapStateToProps2 = _interopRequireDefault(_wrapMapStateToProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('wrapMapStateToProps', function () {
  it('should save form if no mapStateToProps given', function () {
    var getForm = (0, _expect.createSpy)().andReturn('foo');
    var result = (0, _wrapMapStateToProps2.default)(undefined, getForm);
    (0, _expect2.default)(result).toBeA('function');
    (0, _expect2.default)(result.length).toBe(1);
    var mapped = result('bar');
    (0, _expect2.default)(getForm).toHaveBeenCalled().toHaveBeenCalledWith('bar');
    (0, _expect2.default)(mapped).toEqual({ form: 'foo' });
  });

  it('should throw error when mapStateToProps is not a function', function () {
    var getForm = (0, _expect.createSpy)();
    (0, _expect2.default)(function () {
      return (0, _wrapMapStateToProps2.default)(true, getForm);
    }).toThrow('mapStateToProps must be a function');
    (0, _expect2.default)(function () {
      return (0, _wrapMapStateToProps2.default)(42, getForm);
    }).toThrow('mapStateToProps must be a function');
    (0, _expect2.default)(function () {
      return (0, _wrapMapStateToProps2.default)({}, getForm);
    }).toThrow('mapStateToProps must be a function');
    (0, _expect2.default)(function () {
      return (0, _wrapMapStateToProps2.default)([], getForm);
    }).toThrow('mapStateToProps must be a function');
    (0, _expect2.default)(getForm).toNotHaveBeenCalled();
  });

  it('should call mapStateToProps when one-param function given', function () {
    var getForm = (0, _expect.createSpy)().andReturn('foo');
    var mapStateToPropsSpy = (0, _expect.createSpy)().andReturn({ a: 42, b: true, c: 'baz' });
    var mapStateToProps = function mapStateToProps(state) {
      return mapStateToPropsSpy(state);
    };
    (0, _expect2.default)(mapStateToProps.length).toBe(1);

    var result = (0, _wrapMapStateToProps2.default)(mapStateToProps, getForm);
    (0, _expect2.default)(result).toBeA('function');
    (0, _expect2.default)(result.length).toBe(1);
    var mapped = result('bar');
    (0, _expect2.default)(mapStateToPropsSpy).toHaveBeenCalled().toHaveBeenCalledWith('bar');
    (0, _expect2.default)(getForm).toHaveBeenCalled().toHaveBeenCalledWith('bar');

    (0, _expect2.default)(mapped).toEqual({
      a: 42,
      b: true,
      c: 'baz',
      form: 'foo'
    });
  });

  it('should call mapStateToProps when two-param function given', function () {
    var getForm = (0, _expect.createSpy)().andReturn('foo');
    var mapStateToPropsSpy = (0, _expect.createSpy)().andReturn({ a: 42, b: true, c: 'baz' });
    var mapStateToProps = function mapStateToProps(state, ownProps) {
      return mapStateToPropsSpy(state, ownProps);
    };
    (0, _expect2.default)(mapStateToProps.length).toBe(2);

    var result = (0, _wrapMapStateToProps2.default)(mapStateToProps, getForm);
    (0, _expect2.default)(result).toBeA('function');
    (0, _expect2.default)(result.length).toBe(2);
    var mapped = result('bar', 'dog');
    (0, _expect2.default)(mapStateToPropsSpy).toHaveBeenCalled().toHaveBeenCalledWith('bar', 'dog');
    (0, _expect2.default)(getForm).toHaveBeenCalled().toHaveBeenCalledWith('bar');

    (0, _expect2.default)(mapped).toEqual({
      a: 42,
      b: true,
      c: 'baz',
      form: 'foo'
    });
  });
});