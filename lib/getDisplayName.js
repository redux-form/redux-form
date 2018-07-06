'use strict';

exports.__esModule = true;
exports.default = getDisplayName;
function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}