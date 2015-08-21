import { BLUR, CHANGE, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, TOUCH, TOUCH_ALL, UNTOUCH, UNTOUCH_ALL } from './actionTypes';

export function blur(form, field, value) {
  return {type: BLUR, form: form, field, value};
}

export function change(form, field, value) {
  return {type: CHANGE, form, field, value};
}

export function initialize(form, data) {
  return {type: INITIALIZE, form, data};
}

export function reset(form) {
  return {type: RESET, form};
}

export function startAsyncValidation(form) {
  return {type: START_ASYNC_VALIDATION, form};
}

export function startSubmit(form) {
  return {type: START_SUBMIT, form};
}

export function stopAsyncValidation(form, errors) {
  return {type: STOP_ASYNC_VALIDATION, form, errors};
}

export function stopSubmit(form) {
  return {type: STOP_SUBMIT, form};
}

export function touch(form, ...fields) {
  return {type: TOUCH, form, fields};
}

export function touchAll(form) {
  return {type: TOUCH_ALL, form};
}

export function untouch(form, ...fields) {
  return {type: UNTOUCH, form, fields};
}

export function untouchAll(form) {
  return {type: UNTOUCH_ALL, form};
}
