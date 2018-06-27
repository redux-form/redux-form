import { takeEvery, call, put } from 'redux-saga/effects'
import { startSubmit, setSubmitSucceeded, setSubmitFailed } from 'redux-form'
import submit from './submit'

export function* submitForm(action) {
  console.log(action)
  yield put(startSubmit('remoteSubmit'))
  try {
    yield call(submit, action.payload)
    yield put(setSubmitSucceeded('remoteSubmit'))
  } catch (error) {
    console.log(error)
    yield put(setSubmitFailed('remoteSubmit'))
  }
}

export function* helloSaga() {
  yield takeEvery('FORM_SAGA', submitForm)
}
