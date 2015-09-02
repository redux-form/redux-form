import { BLUR, CHANGE, FOCUS, INITIALIZE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION,
  STOP_SUBMIT, TOUCH, UNTOUCH } from './actionTypes';

export function blur(field, value) {
  return {type: BLUR, field, value};
}

export function change(field, value) {
  return {type: CHANGE, field, value};
}

export function focus(data) {
  return {type: FOCUS, data};
}

export function initialize(data) {
  return {type: INITIALIZE, data};
}

export function reset() {
  return {type: RESET};
}

export function startAsyncValidation() {
  return {type: START_ASYNC_VALIDATION};
}

export function startSubmit() {
  return {type: START_SUBMIT};
}

export function stopAsyncValidation(errors) {
  return {type: STOP_ASYNC_VALIDATION, errors};
}

export function stopSubmit() {
  return {type: STOP_SUBMIT};
}

export function touch(...fields) {
  return {type: TOUCH, fields};
}

export function untouch(...fields) {
  return {type: UNTOUCH, fields};
}
