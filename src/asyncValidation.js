import isPromise from 'is-promise';
import isValid from './isValid';

const asyncValidation = (fn, start, stop) => {
  start();
  const promise = fn();
  if (!isPromise(promise)) {
    throw new Error('asyncValidate function passed to reduxForm must return a promise');
  }
  const handleErrors = rejected => errors => {
    stop(errors);
    return !rejected && isValid(errors) ? Promise.resolve() : Promise.reject();
  };
  return promise.then(handleErrors(false), handleErrors(true));
};

export default asyncValidation;
