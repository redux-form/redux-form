import isPromise from 'is-promise'
import SubmissionError from './SubmissionError'

const handleSubmit = (submit, props, valid, asyncValidate, fields) => {
  const {
    dispatch, startSubmit, stopSubmit, setSubmitFailed, syncErrors, touch, values
  } = props

  touch(...fields) // mark all fields as touched

  if (valid) {
    const doSubmit = () => {
      const result = submit(values, dispatch)
      if (isPromise(result)) {
        startSubmit()
        return result
          .then(submitResult => {
            stopSubmit()
            return submitResult
          }, submitError => {
            const error = submitError instanceof SubmissionError ? submitError.errors : undefined
            stopSubmit(error)
            return Promise.reject(error)
          })
      }
      return result
    }

    const asyncValidateResult = asyncValidate && asyncValidate()
    if (asyncValidateResult) {
      return asyncValidateResult
        .then(
          doSubmit,
          asyncErrors => {
            setSubmitFailed(...fields)
            return Promise.reject(asyncErrors)
          })
    } else {
      return doSubmit()
    }
  } else {
    setSubmitFailed(...fields)
    return Promise.reject(syncErrors)
  }
}

export default handleSubmit
