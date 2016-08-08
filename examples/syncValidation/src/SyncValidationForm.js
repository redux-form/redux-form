import React from 'react'
import { Field, reduxForm } from 'redux-form'
import _validate from 'redux-validate'

const validate =
  _validate([ 'username', 'email', 'age' ], 'Required')
    .then({
      username: username => username && username.length > 15 && 'Must be 15 characters or less',
      email: email => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) &&
        'Invalid email address',
      age: age => isNaN(Number(age)) && 'Must be a number'
    })
    .then('age', age => Number(age) < 18 && 'Sorry, you must be at least 18 years old')

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const SyncValidationForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="username" type="text" component={renderField} label="Username"/>
      <Field name="email" type="email" component={renderField} label="Email"/>
      <Field name="age" type="number" component={renderField} label="Age"/>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'syncValidation',  // a unique identifier for this form
  validate                 // <--- validation function given to redux-form
})(SyncValidationForm)
