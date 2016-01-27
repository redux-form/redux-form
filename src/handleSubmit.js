import isPromise from 'is-promise';
import isValid from './isValid';
import SubmissionError from './submissionError';

const handleSubmit = (submit, values, props, asyncValidate) => {
  const {dispatch, fields, startSubmit, stopSubmit, submitFailed, returnRejectedSubmitPromise, touch, validate} = props;
  const syncErrors = validate(values, props);
  const isSubmissionError = err => (err instanceof SubmissionError);
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
          if (returnRejectedSubmitPromise || !isSubmissionError(submitError)) {
            return Promise.reject(submitError);
          }
        });
      }
      return result;
    };
    const asyncValidateResult = asyncValidate();
    return isPromise(asyncValidateResult) ?
      // asyncValidateResult will be rejected if async validation failed
      asyncValidateResult.then(doSubmit, err => {
        submitFailed();
        return (returnRejectedSubmitPromise || !isSubmissionError(err)) ? Promise.reject(err) : Promise.resolve();
      }) :
      doSubmit(); // no async validation, so submit
  }
  submitFailed();

  if (returnRejectedSubmitPromise) {
    return Promise.reject();
  }
};

export default handleSubmit;
