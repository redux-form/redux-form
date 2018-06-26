import { takeEvery } from 'redux-saga/effects'

export function* submitForm(action) {
  console.log(action)
  yield
}

export function* helloSaga() {
  yield takeEvery('MY_FORM_SUBMISSION', submitForm)
}
