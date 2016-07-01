import isPromise from 'is-promise'
import SubmissionError from './SubmissionError'

const handleSubmit = (submit, props, valid, asyncValidate, fields) => {
  const {
    dispatch, onSubmitFail, onSubmitSuccess, startSubmit, stopSubmit, setSubmitFailed,
    syncErrors, touch, values
  } = props

  touch(...fields) // mark all fields as touched

  if (valid) {
    const doSubmit = () => {
      let result
      try {
        result = submit(values, dispatch)
      } catch (submitError) {
        const error = submitError instanceof SubmissionError ? submitError.errors : undefined
        if(onSubmitFail) {
          onSubmitFail(error)
        }
        return error
      }
      if (isPromise(result)) {
        startSubmit()
        return result
          .then(submitResult => {
            stopSubmit()
            if(onSubmitSuccess) {
              onSubmitSuccess(submitResult)
            }
            return submitResult
          }, submitError => {
            const error = submitError instanceof SubmissionError ? submitError.errors : undefined
            stopSubmit(error)
            if(onSubmitFail) {
              onSubmitFail(error)
            }
            return Promise.reject(error)
          })
      }
      if(onSubmitSuccess) {
        onSubmitSuccess(result)
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
            if(onSubmitFail) {
              onSubmitFail(asyncErrors)
            }
            return Promise.reject(asyncErrors)
          })
    } else {
      return doSubmit()
    }
  } else {
    setSubmitFailed(...fields)
    if(onSubmitFail) {
      onSubmitFail(syncErrors)
    }
    // Can't know here if submission is sync or async, so we guess async (the most common case) and
    // return the sync errors in a promise.
    return Promise.reject(syncErrors)
  }
}

export default handleSubmit
