import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import asyncValidate from './asyncValidate'

const renderField = props => (
  <div>
    <label>{props.placeholder}</label>
    <div className={props.asyncValidating ? 'async-validating' : ''}>
      <input {...props}/>
      {props.touched && props.error && <span>{props.error}</span>}
    </div>
  </div>
)

const AsyncValidationForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="username" type="text" component={renderField} placeholder="Username"/>
      <Field name="password" type="password" component={renderField} placeholder="Password"/>
      <div>
        <button type="submit" disabled={submitting}>Sign Up</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'asyncValidation', // a unique identifier for this form
  validate,
  asyncValidate,
  asyncBlurFields: [ 'username' ]
})(AsyncValidationForm)
