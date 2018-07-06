'use strict';

exports.__esModule = true;
var dataKey = exports.dataKey = 'value';
var createOnDragStart = function createOnDragStart(name, getValue) {
  return function (event) {
    event.dataTransfer.setData(dataKey, getValue());
  };
};

exports.default = createOnDragStart;