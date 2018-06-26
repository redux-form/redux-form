import React from 'react'
import { Field, reduxForm } from 'redux-form'
import submit from './submit'

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const RemoteSubmitForm = props => {
  const { error, handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="username"
        type="text"
        component={renderField}
        label="Username"
      />
      <Field
        name="password"
        type="password"
        component={renderField}
        label="Password"
      />
      {error && <strong>{error}</strong>}
      <button type="submit">Submit</button>
    </form>
  )
}

export default reduxForm({
  form: 'remoteSubmit', // a unique identifier for this form // submit function must be passed to onSubmit
  submitAsSideEffect: true,
  onSubmit: (data, dispatch, props) => {
    return {
      type: 'MY_FORM_SUBMISSION',
      payload: data
    }
  }
})(RemoteSubmitForm)
