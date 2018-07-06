'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _createOnDrop = require('../createOnDrop');

var _createOnDrop2 = _interopRequireDefault(_createOnDrop);

var _createOnDragStart = require('../createOnDragStart');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('createOnDrop', function () {
  it('should return a function', function () {
    (0, _expect2.default)((0, _createOnDrop2.default)()).toExist().toBeA('function');
  });

  it('should return a function that calls change with result from getData', function () {
    var change = (0, _expect.createSpy)();
    var getData = (0, _expect.createSpy)().andReturn('bar');
    (0, _createOnDrop2.default)('foo', change)({
      dataTransfer: { getData: getData }
    });
    (0, _expect2.default)(getData).toHaveBeenCalled().toHaveBeenCalledWith(_createOnDragStart.dataKey);
    (0, _expect2.default)(change).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'bar');
  });
});