import { CHANGE, VALIDATE, RESET } from './actionTypes';

export function change(form, field, value) {
  return {
    type: CHANGE,
    form: form,
    field: field,
    value: value
  };
}

export function validate(form) {
  return {
    type: VALIDATE,
    form: form
  };
}

export function reset(form) {
  return {
    type: RESET,
    form: form
  };
}
