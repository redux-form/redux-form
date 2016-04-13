import { ADD_ARRAY_VALUE, BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, REMOVE_ARRAY_VALUE, RESET, START_ASYNC_VALIDATION,
  START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, SUBMIT_FAILED, SWAP_ARRAY_VALUES, TOUCH, UNTOUCH } from './actionTypes';

export const addArrayValue = (path, value, index, fields) =>
  ({type: ADD_ARRAY_VALUE, payload: {path, value, index, fields}});

export const blur = (field, value) =>
  ({type: BLUR, payload: {field, value}});

export const change = (field, value) =>
  ({type: CHANGE, payload: {field, value}});

export const destroy = () =>
  ({type: DESTROY});

export const focus = field =>
  ({type: FOCUS, payload: {field}});

export const initialize = (data, fields) => {
  if (!Array.isArray(fields)) {
    throw new Error('must provide fields array to initialize() action creator');
  }
  return {type: INITIALIZE, payload: {data, fields}};
};

export const removeArrayValue = (path, index) =>
  ({type: REMOVE_ARRAY_VALUE, payload: {path, index}});

export const reset = () =>
  ({type: RESET});

export const startAsyncValidation = field =>
  ({type: START_ASYNC_VALIDATION, payload: {field}});

export const startSubmit = () =>
  ({type: START_SUBMIT});

export const stopAsyncValidation = errors =>
  ({type: STOP_ASYNC_VALIDATION, payload: {errors}});

export const stopSubmit = errors =>
  ({type: STOP_SUBMIT, payload: {errors}});

export const submitFailed = () =>
  ({type: SUBMIT_FAILED});

export const swapArrayValues = (path, indexA, indexB) =>
  ({type: SWAP_ARRAY_VALUES, payload: {path, indexA, indexB}});

export const touch = (...fields) =>
  ({type: TOUCH, payload: {fields}});

export const untouch = (...fields) =>
  ({type: UNTOUCH, payload: {fields}});
