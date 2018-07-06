"use strict";

exports.__esModule = true;
var isEvent = function isEvent(candidate) {
  return !!(candidate && candidate.stopPropagation && candidate.preventDefault);
};

exports.default = isEvent;