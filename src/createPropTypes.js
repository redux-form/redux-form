const createPropTypes = ({PropTypes: {any, bool, string, func, object}}) => ({
  // State:
  active: string,                     // currently active field
  asyncValidating: bool.isRequired,   // true if async validation is running
  autofilled: bool,                   // true if set programmatically by autofill
  dirty: bool.isRequired,             // true if any values are different from initialValues
  error: any,                         // form-wide error from '_error' key in validation result
  errors: object,                     // a map of errors corresponding to structure of form data (result of validation)
  fields: object.isRequired,          // the map of fields
  formKey: any,                       // the form key if one was provided (used when doing multirecord forms)
  invalid: bool.isRequired,           // true if there are any validation errors
  pristine: bool.isRequired,          // true if the values are the same as initialValues
  submitting: bool.isRequired,        // true if the form is in the process of being submitted
  submitFailed: bool.isRequired,      // true if the form was submitted and failed for any reason
  valid: bool.isRequired,             // true if there are no validation errors
  values: object.isRequired,          // the values of the form as they will be submitted

  // Actions:
  asyncValidate: func.isRequired,     // function to trigger async validation
  destroyForm: func.isRequired,       // action to destroy the form's data in Redux
  handleSubmit: func.isRequired,      // function to submit the form
  initializeForm: func.isRequired,    // action to initialize form data
  resetForm: func.isRequired,         // action to reset the form data to previously initialized values
  touch: func.isRequired,             // action to mark fields as touched
  touchAll: func.isRequired,          // action to mark ALL fields as touched
  untouch: func.isRequired,           // action to mark fields as untouched
  untouchAll: func.isRequired         // action to mark ALL fields as untouched
});

export default createPropTypes;
