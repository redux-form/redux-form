"use strict";

exports.__esModule = true;
var createOnFocus = function createOnFocus(name, focus) {
  return function () {
    return focus(name);
  };
};
exports.default = createOnFocus;