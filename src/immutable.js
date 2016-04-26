import createAll from './createAll'
import immutable from './structure/immutable'

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
  setSubmitFailed,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  SubmissionError,
  swapArrayValues,
  touch,
  untouch,
  values
} = createAll(immutable)
