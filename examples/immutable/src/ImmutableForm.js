import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable' // <--- immutable import
import validate from './validate'

const renderField = props => (
  <div>
    <label>{props.placeholder}</label>
    <div>
      <input {...props}/>
      {props.touched && props.error && <span>{props.error}</span>}
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
