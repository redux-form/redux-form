'use strict';

exports.__esModule = true;

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _isValid = require('./isValid');

var _isValid2 = _interopRequireDefault(_isValid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleSubmit = function handleSubmit(submit, values, props, asyncValidate) {
  var dispatch = props.dispatch,
      fields = props.fields,
      onSubmitSuccess = props.onSubmitSuccess,
      onSubmitFail = props.onSubmitFail,
      startSubmit = props.startSubmit,
      stopSubmit = props.stopSubmit,
      submitFailed = props.submitFailed,
      returnRejectedSubmitPromise = props.returnRejectedSubmitPromise,
      touch = props.touch,
      validate = props.validate;

  var syncErrors = validate(values, props);
  touch.apply(undefined, fields); // touch all fields
  if ((0, _isValid2.default)(syncErrors)) {
    var doSubmit = function doSubmit() {
      var result = submit(values, dispatch);
      if ((0, _isPromise2.default)(result)) {
        startSubmit();
        return result.then(function (submitResult) {
          stopSubmit();
          if (onSubmitSuccess) {
            onSubmitSuccess(submitResult);
          }
          return submitResult;
        }, function (submitError) {
          stopSubmit(submitError);
          if (onSubmitFail) {
            onSubmitFail(submitError);
          }
          if (returnRejectedSubmitPromise) {
            return Promise.reject(submitError);
          }
        });
      }
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
      return result;
    };
    var asyncValidateResult = asyncValidate();
    return (0, _isPromise2.default)(asyncValidateResult) ?
    // asyncValidateResult will be rejected if async validation failed
    asyncValidateResult.then(doSubmit, function () {
      submitFailed();
      if (onSubmitFail) {
        onSubmitFail();
      }
      return returnRejectedSubmitPromise ? Promise.reject() : Promise.resolve();
    }) : doSubmit(); // no async validation, so submit
  }
  submitFailed();

  if (onSubmitFail) {
    onSubmitFail(syncErrors);
  }

  if (returnRejectedSubmitPromise) {
    return Promise.reject(syncErrors);
  }
};

exports.default = handleSubmit;