import React from 'react'
import { Field, Form, reduxForm } from 'redux-form'
import submit from './submit'

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const RemoteSubmitForm = (props) => {
  const { error, handleSubmit } = props
  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Field name="username" type="text" component={renderField} label="Username"/>
      <Field name="password" type="password" component={renderField} label="Password"/>
      {error && <strong>{error}</strong>}
      <div>
        No submit button in the form. The submit button below is a separate unlinked component.
      </div>
    </Form>
  )
}

export default reduxForm({
  form: 'remoteSubmit'  // a unique identifier for this form
})(RemoteSubmitForm)
