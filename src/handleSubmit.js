import isPromise from 'is-promise';
import isValid from './isValid';

const handleSubmit = (submit, values, props, asyncValidate) => {
  const {dispatch, fields, startSubmit, stopSubmit, returnRejectedSubmitPromise, touch, validate} = props;
  const syncErrors = validate(values, props);
  touch(...fields); // touch all fields
  if (isValid(syncErrors)) {
    const doSubmit = () => {
      const result = submit(values, dispatch);
      if (isPromise(result)) {
        startSubmit();
        return result.then(submitResult => {
          stopSubmit();
          return submitResult;
        }, submitError => {
          stopSubmit(submitError);
          if (returnRejectedSubmitPromise) {
            return Promise.reject(submitError);
          }
        });
      }
      return result;
    };
    const asyncValidateResult = asyncValidate(values);
    return isPromise(asyncValidateResult) ?
      asyncValidateResult.then(doSubmit) : // will be rejected if async validation failed
      doSubmit(); // no async validation, so submit
  }
};

export default handleSubmit;
