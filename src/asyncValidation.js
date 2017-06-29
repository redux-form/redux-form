// @flow
import isPromise from 'is-promise'

type Callback = () => Promise<void>
type StartCallback = (field: string) => void
type StopCallback = (errors: ?Object) => void

const asyncValidation = (
  fn: Callback,
  start: StartCallback,
  stop: StopCallback,
  field: string
) => {
  start(field)
  const promise = fn()
  if (!isPromise(promise)) {
    throw new Error(
      'asyncValidate function passed to reduxForm must return a promise'
    )
  }
  const handleErrors = rejected => errors => {
    if (errors && Object.keys(errors).length) {
      stop(errors)
      return errors
    } else if (rejected) {
      stop()
      throw new Error(
        'Asynchronous validation promise was rejected without errors.'
      )
    }
    stop()
    return Promise.resolve()
  }
  return promise.then(handleErrors(false), handleErrors(true))
}

export default asyncValidation
