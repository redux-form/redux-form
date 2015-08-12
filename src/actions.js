import { BLUR, CHANGE, INITIALIZE, RESET, START_ASYNC_VALIDATION, STOP_ASYNC_VALIDATION,
  TOUCH, TOUCH_ALL, UNTOUCH, UNTOUCH_ALL } from './actionTypes';

export function blur(form, field, value) {
  return {
    type: BLUR,
    form: form,
    field: field,
    value: value
  };
}

export function change(form, field, value) {
  return {
    type: CHANGE,
    form: form,
    field: field,
    value: value
  };
}

export function initialize(form, data) {
  return {
    type: INITIALIZE,
    form: form,
    data: data
  };
}

export function reset(form) {
  return {
    type: RESET,
    form: form
  };
}

export function startAsyncValidation(form) {
  return {
    type: START_ASYNC_VALIDATION,
    form: form
  };
}

export function stopAsyncValidation(form, errors) {
  return {
    type: STOP_ASYNC_VALIDATION,
    form: form,
    errors: errors
  };
}

export function touch(form, ...fields) {
  return {
    type: TOUCH,
    form: form,
    fields: fields
  };
}

export function touchAll(form) {
  return {
    type: TOUCH_ALL,
    form: form
  };
}

export function untouch(form, ...fields) {
  return {
    type: UNTOUCH,
    form: form,
    fields: fields
  };
}

export function untouchAll(form) {
  return {
    type: UNTOUCH_ALL,
    form: form
  };
}
