import isPromise from 'is-promise'
import Promise from 'promise'
import SubmissionError from './SubmissionError'

const handleSubmit = (submit, props, valid, asyncValidate, fields) => {
  const {
    dispatch, onSubmitFail, onSubmitSuccess, startSubmit, stopSubmit, setSubmitFailed,
    setSubmitSucceeded, syncErrors, touch, values, persistentSubmitErrors
  } = props

  touch(...fields) // mark all fields as touched

  let doStopSubmit = () => {}
  const doStartSubmit = () => {
    doStopSubmit = stopSubmit
    startSubmit()
  }
  
  // XXX: Always submitting when persistentSubmitErrors is enabled ignores sync errors.
  // It would be better to check whether the form as any other errors except submit errors.
  // This would either require changing the meaning of `valid` (maybe breaking change),
  // having a more complex conditional in here, or executing sync validation in here
  // the same way as async validation is executed.

  let asyncValidationFailed = false
  return Promise.resolve()
    .then(() => {
      if (!valid && !persistentSubmitErrors) {
        throw new SubmissionError(syncErrors)
      }
    })
    
    .then(() => {
      if (asyncValidate) {
        return Promise.resolve(asyncValidate())
          .then(asyncErrors => {
            if (asyncErrors) {
              asyncValidationFailed = true
              throw new SubmissionError(asyncErrors)
            }
          }, asyncErrors => {
            asyncValidationFailed = true
            if (!(asyncErrors instanceof Error)) {
              throw new SubmissionError(asyncErrors)
            }
            throw asyncErrors
          })
      }
    })
    
    .then(() => {
      const result = submit(values, dispatch, props)

      if (isPromise(result)) {
        doStartSubmit()
      }
      return result
    })
    
    .then(result => {
      doStopSubmit()
      setSubmitSucceeded()
      if (onSubmitSuccess) {
        onSubmitSuccess(result, dispatch)
      }
      
      return result
    })
    
    .catch(submitError => {
      const errors = submitError instanceof SubmissionError ? submitError.errors : undefined
      doStopSubmit(errors)
      
      setSubmitFailed(...fields)

      if (onSubmitFail) {
        onSubmitFail(errors, dispatch, submitError)
      }

      if (errors) {
        if (asyncValidationFailed) {
          return Promise.reject(errors)
        } else {
          return errors
        }
      } else {
        if (!onSubmitFail) {
          return Promise.reject(submitError)
        }
      }
    })
  
}

export default handleSubmit
