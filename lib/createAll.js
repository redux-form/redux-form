'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createAll;

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _createReduxForm = require('./createReduxForm');

var _createReduxForm2 = _interopRequireDefault(_createReduxForm);

var _mapValues = require('./mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _bindActionData = require('./bindActionData');

var _bindActionData2 = _interopRequireDefault(_bindActionData);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _actionTypes = require('./actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

var _createPropTypes = require('./createPropTypes');

var _createPropTypes2 = _interopRequireDefault(_createPropTypes);

var _getValuesFromState = require('./getValuesFromState');

var _getValuesFromState2 = _interopRequireDefault(_getValuesFromState);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// bind form as first parameter of action creators
var boundActions = _extends({}, (0, _mapValues2.default)(_extends({}, actions, {
  autofillWithKey: function autofillWithKey(key) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (0, _bindActionData2.default)(actions.autofill, { key: key }).apply(undefined, args);
  },
  changeWithKey: function changeWithKey(key) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return (0, _bindActionData2.default)(actions.change, { key: key }).apply(undefined, args);
  },
  initializeWithKey: function initializeWithKey(key) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return (0, _bindActionData2.default)(actions.initialize, { key: key }).apply(undefined, args);
  },
  reset: function reset(key) {
    return (0, _bindActionData2.default)(actions.reset, { key: key })();
  },
  touchWithKey: function touchWithKey(key) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    return (0, _bindActionData2.default)(actions.touch, { key: key }).apply(undefined, args);
  },
  untouchWithKey: function untouchWithKey(key) {
    for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }

    return (0, _bindActionData2.default)(actions.untouch, { key: key }).apply(undefined, args);
  },
  destroy: function destroy(key) {
    return (0, _bindActionData2.default)(actions.destroy, { key: key })();
  }
}), function (action) {
  return function (form) {
    for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      args[_key6 - 1] = arguments[_key6];
    }

    return (0, _bindActionData2.default)(action, { form: form }).apply(undefined, args);
  };
}));

var addArrayValue = boundActions.addArrayValue;
var autofill = boundActions.autofill;
var autofillWithKey = boundActions.autofillWithKey;
var blur = boundActions.blur;
var change = boundActions.change;
var changeWithKey = boundActions.changeWithKey;
var destroy = boundActions.destroy;
var focus = boundActions.focus;
var initialize = boundActions.initialize;
var initializeWithKey = boundActions.initializeWithKey;
var removeArrayValue = boundActions.removeArrayValue;
var reset = boundActions.reset;
var startAsyncValidation = boundActions.startAsyncValidation;
var startSubmit = boundActions.startSubmit;
var stopAsyncValidation = boundActions.stopAsyncValidation;
var stopSubmit = boundActions.stopSubmit;
var submitFailed = boundActions.submitFailed;
var swapArrayValues = boundActions.swapArrayValues;
var touch = boundActions.touch;
var touchWithKey = boundActions.touchWithKey;
var untouch = boundActions.untouch;
var untouchWithKey = boundActions.untouchWithKey;

function createAll(isReactNative, React, connect) {
  return {
    actionTypes: actionTypes,
    addArrayValue: addArrayValue,
    autofill: autofill,
    autofillWithKey: autofillWithKey,
    blur: blur,
    change: change,
    changeWithKey: changeWithKey,
    destroy: destroy,
    focus: focus,
    getValues: _getValuesFromState2.default,
    initialize: initialize,
    initializeWithKey: initializeWithKey,
    propTypes: (0, _createPropTypes2.default)(React),
    reduxForm: (0, _createReduxForm2.default)(isReactNative, React, connect),
    reducer: _reducer2.default,
    removeArrayValue: removeArrayValue,
    reset: reset,
    startAsyncValidation: startAsyncValidation,
    startSubmit: startSubmit,
    stopAsyncValidation: stopAsyncValidation,
    stopSubmit: stopSubmit,
    submitFailed: submitFailed,
    swapArrayValues: swapArrayValues,
    touch: touch,
    touchWithKey: touchWithKey,
    untouch: untouch,
    untouchWithKey: untouchWithKey
  };
}