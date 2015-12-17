import isPromise from 'is-promise';
import isValid from './isValid';

const asyncValidation = (fn, start, stop, field) => {
  start(field);
  const promise = fn();
  if (!isPromise(promise)) {
    throw new Error('asyncValidate function passed to reduxForm must return a promise');
  }
  const handleErrors = rejected => errors => {
    if (!isValid(errors)) {
      stop(field, errors);
      return Promise.reject();
    } else if (rejected) {
      stop(field);
      throw new Error('Asynchronous validation promise was rejected without errors.');
    }
    stop(field);
    return Promise.resolve();
  };
  return promise.then(handleErrors(false), handleErrors(true));
};

export default asyncValidation;
