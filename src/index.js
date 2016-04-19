import createAll from './createAll'
import plain from './structure/plain'

export const {
  actionTypes,
  addArrayValue,
  blur,
  change,
  destroy,
  Field,
  focus,
  reducer,
  reduxForm,
  removeArrayValue,
  initialize,
  propTypes,
  reset,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  SubmissionError,
  swapArrayValues,
  touch,
  untouch,
  values
} = createAll(plain)
