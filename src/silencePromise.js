import isPromise from 'is-promise';

const noop = () => undefined;

const silencePromise = promise =>
  isPromise(promise) ?
    promise.then(noop, noop) :
    promise;

export default silencePromise;
