import { stopSubmit } from 'redux-form'

// some redux middleware
function asyncFailed () {
  return (dispatch) => {
    ...
    dispatch(stopSubmit(formName, validationErrors))
  }
}
