import PropTypes from 'prop-types';

const createPropTypes = () => ({
  // State:
  active: PropTypes.string,                     // currently active field
  asyncValidating: PropTypes.bool.isRequired,   // true if async validation is running
  autofilled: PropTypes.bool,                   // true if set programmatically by autofill
  dirty: PropTypes.bool.isRequired,             // true if any values are different from initialValues
  error: PropTypes.any,                         // form-wide error from '_error' key in validation result
  errors: PropTypes.object,                     // a map of errors corresponding to structure of form data (result of validation)
  fields: PropTypes.object.isRequired,          // the map of fields
  formKey: PropTypes.any,                       // the form key if one was provided (used when doing multirecord forms)
  invalid: PropTypes.bool.isRequired,           // true if there are any validation errors
  pristine: PropTypes.bool.isRequired,          // true if the values are the same as initialValues
  submitting: PropTypes.bool.isRequired,        // true if the form is in the process of being submitted
  submitFailed: PropTypes.bool.isRequired,      // true if the form was submitted and failed for any reason
  valid: PropTypes.bool.isRequired,             // true if there are no validation errors
  values: PropTypes.object.isRequired,          // the values of the form as they will be submitted

  // Actions:
  asyncValidate: PropTypes.func.isRequired,     // function to trigger async validation
  destroyForm: PropTypes.func.isRequired,       // action to destroy the form's data in Redux
  handleSubmit: PropTypes.func.isRequired,      // function to submit the form
  initializeForm: PropTypes.func.isRequired,    // action to initialize form data
  resetForm: PropTypes.func.isRequired,         // action to reset the form data to previously initialized values
  touch: PropTypes.func.isRequired,             // action to mark fields as touched
  touchAll: PropTypes.func.isRequired,          // action to mark ALL fields as touched
  untouch: PropTypes.func.isRequired,           // action to mark fields as untouched
  untouchAll: PropTypes.func.isRequired         // action to mark ALL fields as untouched
});

export default createPropTypes;
