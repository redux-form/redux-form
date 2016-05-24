import React from 'react'
import { Field, reduxForm } from 'redux-form'
import adapter from './adapter'

const validate = values => {
  const errors = {}
  const requiredFields = [ 'username', 'password', 'email', 'age' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  return errors
}

const AdapterForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="username" label="Username" component="myCustomText"/>
      <Field name="password" label="Password" component="myCustomPassword"/>
      <Field name="email" label="Email" component="myCustomEmail"/>
      <Field name="age" label="Age" component="myCustomNumber"/>
      <div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'adapterExample',  // a unique identifier for this form
  adapter,
  validate
})(AdapterForm)
