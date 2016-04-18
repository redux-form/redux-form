import isPromise from 'is-promise';
import isValid from './isValid';

const handleSubmit = (submit, values, props, asyncValidate) => {
  const {
    dispatch, fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
    submitFailed, returnRejectedSubmitPromise, touch, validate
  } = props;
  const syncErrors = validate(values, props);
  touch(...fields); // touch all fields
  if (isValid(syncErrors)) {
    const doSubmit = () => {
      const result = submit(values, dispatch);
      if (isPromise(result)) {
        startSubmit();
        return result.then(submitResult => {
          stopSubmit();
          if (onSubmitSuccess) {
            onSubmitSuccess(submitResult);
          }
          return submitResult;
        }, submitError => {
          stopSubmit(submitError);
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
    const asyncValidateResult = asyncValidate();
    return isPromise(asyncValidateResult) ?
      // asyncValidateResult will be rejected if async validation failed
      asyncValidateResult.then(doSubmit, () => {
        submitFailed();
        if (onSubmitFail) {
          onSubmitFail();
        }
        return returnRejectedSubmitPromise ? Promise.reject() : Promise.resolve();
      }) :
      doSubmit(); // no async validation, so submit
  }
  submitFailed();

  if (onSubmitFail) {
    onSubmitFail(syncErrors);
  }

  if (returnRejectedSubmitPromise) {
    return Promise.reject(syncErrors);
  }
};

export default handleSubmit;
