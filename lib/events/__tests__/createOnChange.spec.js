'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _createOnChange = require('../createOnChange');

var _createOnChange2 = _interopRequireDefault(_createOnChange);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('createOnChange', function () {
  it('should return a function', function () {
    (0, _expect2.default)((0, _createOnChange2.default)()).toExist().toBeA('function');
  });

  it('should return a function that calls change with name and value', function () {
    var change = (0, _expect.createSpy)();
    (0, _createOnChange2.default)('foo', change)('bar');
    (0, _expect2.default)(change).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'bar');
  });
});