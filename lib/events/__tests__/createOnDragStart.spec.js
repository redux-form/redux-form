'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _createOnDragStart = require('../createOnDragStart');

var _createOnDragStart2 = _interopRequireDefault(_createOnDragStart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('createOnDragStart', function () {
  it('should return a function', function () {
    (0, _expect2.default)((0, _createOnDragStart2.default)()).toExist().toBeA('function');
  });

  it('should return a function that calls dataTransfer.setData with key and result from getValue', function () {
    var getValue = (0, _expect.createSpy)().andReturn('bar');
    var setData = (0, _expect.createSpy)();
    (0, _createOnDragStart2.default)('foo', getValue)({
      dataTransfer: { setData: setData }
    });
    (0, _expect2.default)(getValue).toHaveBeenCalled();
    (0, _expect2.default)(setData).toHaveBeenCalled().toHaveBeenCalledWith(_createOnDragStart.dataKey, 'bar');
  });
});