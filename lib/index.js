'use strict';

exports.__esModule = true;
exports.untouchWithKey = exports.untouch = exports.touchWithKey = exports.touch = exports.swapArrayValues = exports.stopSubmit = exports.stopAsyncValidation = exports.startSubmit = exports.startAsyncValidation = exports.reset = exports.propTypes = exports.initializeWithKey = exports.initialize = exports.getValues = exports.removeArrayValue = exports.reduxForm = exports.reducer = exports.focus = exports.destroy = exports.changeWithKey = exports.change = exports.blur = exports.autofillWithKey = exports.autofill = exports.addArrayValue = exports.actionTypes = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _createAll2 = require('./createAll');

var _createAll3 = _interopRequireDefault(_createAll2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNative = typeof window !== 'undefined' && window.navigator && window.navigator.product && window.navigator.product === 'ReactNative';

var _createAll = (0, _createAll3.default)(isNative, _react2.default, _reactRedux.connect);

var actionTypes = _createAll.actionTypes,
    addArrayValue = _createAll.addArrayValue,
    autofill = _createAll.autofill,
    autofillWithKey = _createAll.autofillWithKey,
    blur = _createAll.blur,
    change = _createAll.change,
    changeWithKey = _createAll.changeWithKey,
    destroy = _createAll.destroy,
    focus = _createAll.focus,
    reducer = _createAll.reducer,
    reduxForm = _createAll.reduxForm,
    removeArrayValue = _createAll.removeArrayValue,
    getValues = _createAll.getValues,
    initialize = _createAll.initialize,
    initializeWithKey = _createAll.initializeWithKey,
    propTypes = _createAll.propTypes,
    reset = _createAll.reset,
    startAsyncValidation = _createAll.startAsyncValidation,
    startSubmit = _createAll.startSubmit,
    stopAsyncValidation = _createAll.stopAsyncValidation,
    stopSubmit = _createAll.stopSubmit,
    swapArrayValues = _createAll.swapArrayValues,
    touch = _createAll.touch,
    touchWithKey = _createAll.touchWithKey,
    untouch = _createAll.untouch,
    untouchWithKey = _createAll.untouchWithKey;
exports.actionTypes = actionTypes;
exports.addArrayValue = addArrayValue;
exports.autofill = autofill;
exports.autofillWithKey = autofillWithKey;
exports.blur = blur;
exports.change = change;
exports.changeWithKey = changeWithKey;
exports.destroy = destroy;
exports.focus = focus;
exports.reducer = reducer;
exports.reduxForm = reduxForm;
exports.removeArrayValue = removeArrayValue;
exports.getValues = getValues;
exports.initialize = initialize;
exports.initializeWithKey = initializeWithKey;
exports.propTypes = propTypes;
exports.reset = reset;
exports.startAsyncValidation = startAsyncValidation;
exports.startSubmit = startSubmit;
exports.stopAsyncValidation = stopAsyncValidation;
exports.stopSubmit = stopSubmit;
exports.swapArrayValues = swapArrayValues;
exports.touch = touch;
exports.touchWithKey = touchWithKey;
exports.untouch = untouch;
exports.untouchWithKey = untouchWithKey;