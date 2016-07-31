import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable' // <--- immutable import
import validate from './validate'

const renderField = field => (
  <div>
    <label>{field.input.placeholder}</label>
    <div>
      <input {...field.input}/>
      {field.touched && field.error && <span>{field.error}</span>}
    </div>
  </div>
)

const ImmutableForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="username" type="text" component={renderField} placeholder="Username"/>
      <Field name="email" type="email" component={renderField} placeholder="Email"/>
      <Field name="age" type="number" component={renderField} placeholder="Age"/>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'immutableExample',  // a unique identifier for this form
  validate
})(ImmutableForm)
