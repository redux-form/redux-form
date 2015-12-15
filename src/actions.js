import { ADD_ARRAY_VALUE, BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, REMOVE_ARRAY_VALUE, RESET, START_ASYNC_VALIDATION,
  START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, SUBMIT_FAILED, TOUCH, UNTOUCH } from './actionTypes';

export const addArrayValue = (path, value, index) =>
  ({type: ADD_ARRAY_VALUE, path, value, index});

export const blur = (field, value) =>
  ({type: BLUR, field, value});

export const change = (field, value) =>
  ({type: CHANGE, field, value});

export const destroy = () =>
  ({type: DESTROY});

export const focus = field =>
  ({type: FOCUS, field});

export const initialize = (data, fields) => {
  if (!Array.isArray(fields)) {
    throw new Error('must provide fields array to initialize() action creator');
  }
  return {type: INITIALIZE, data, fields};
};

export const removeArrayValue = (path, index) =>
  ({type: REMOVE_ARRAY_VALUE, path, index});

export const reset = () =>
  ({type: RESET});

export const startAsyncValidation = () =>
  ({type: START_ASYNC_VALIDATION});

export const startSubmit = () =>
  ({type: START_SUBMIT});

export const stopAsyncValidation = errors =>
  ({type: STOP_ASYNC_VALIDATION, errors});

export const stopSubmit = errors =>
  ({type: STOP_SUBMIT, errors});

export const submitFailed = () =>
  ({type: SUBMIT_FAILED});

export const touch = (...fields) =>
  ({type: TOUCH, fields});

export const untouch = (...fields) =>
  ({type: UNTOUCH, fields});
