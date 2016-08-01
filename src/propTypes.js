import { PropTypes } from 'react'
const { any, bool, func, shape } = PropTypes

export const propTypes = {
  // State:
  asyncValidating: bool.isRequired,   // true if async validation is running
  dirty: bool.isRequired,             // true if any values are different from initialValues
  error: any,                         // form-wide error from '_error' key in validation result
  invalid: bool.isRequired,           // true if there are any validation errors
  pristine: bool.isRequired,          // true if the values are the same as initialValues
  submitting: bool.isRequired,        // true if the form is in the process of being submitted
  submitFailed: bool.isRequired,      // true if the form was submitted and failed for any reason
  submitSucceeded: bool.isRequired,   // true if the form was successfully submitted
  valid: bool.isRequired,             // true if there are no validation errors
  // Actions:
  array: shape({
    insert: func.isRequired,          // function to insert a value into an array field
    pop: func.isRequired,             // function to pop a value off of an array field
    push: func.isRequired,            // function to push a value onto an array field
    remove: func.isRequired,          // function to remove a value from an array field
    shift: func.isRequired,           // function to shift a value out of an array field
    splice: func.isRequired,          // function to splice a value into an array field
    swap: func.isRequired,            // function to swap values in an array field
    unshift: func.isRequired          // function to unshift a value into an array field
  }),
  asyncValidate: func.isRequired,     // function to trigger async validation
  destroy: func.isRequired,           // action to destroy the form's data in Redux
  handleSubmit: func.isRequired,      // function to submit the form
  initialize: func.isRequired,        // action to initialize form data
  reset: func.isRequired,             // action to reset the form data to previously initialized values
  touch: func.isRequired,             // action to mark fields as touched
  untouch: func.isRequired            // action to mark fields as untouched
}
