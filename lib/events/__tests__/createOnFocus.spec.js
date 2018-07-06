'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _createOnFocus = require('../createOnFocus');

var _createOnFocus2 = _interopRequireDefault(_createOnFocus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('createOnFocus', function () {
  it('should return a function', function () {
    (0, _expect2.default)((0, _createOnFocus2.default)()).toExist().toBeA('function');
  });

  it('should return a function that calls focus with name', function () {
    var focus = (0, _expect.createSpy)();
    (0, _createOnFocus2.default)('foo', focus)();
    (0, _expect2.default)(focus).toHaveBeenCalled().toHaveBeenCalledWith('foo');
  });
});