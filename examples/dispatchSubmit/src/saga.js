import { takeEvery, call, put } from 'redux-saga/effects'
import { startSubmit, stopSubmit } from 'redux-form'

import submit from './submit'
import { FORM_NAME } from './DispatchSubmit'

export function* submitForm(action) {
  yield put(startSubmit(FORM_NAME))
  try {
    yield call(submit, action.payload)
    yield put(stopSubmit(FORM_NAME))
  } catch (error) {
    yield put(stopSubmit(FORM_NAME, error.errors))
  }
}

export function* helloSaga() {
  yield takeEvery('FORM_SAGA', submitForm)
}
