import React from 'react'
import { Field, reduxForm } from 'redux-form'

const style = {
  padding: '10px 20px',
  display: 'block',
  margin: '20px auto',
  fontSize: '16px'
}

const renderField = ({
  input,
  label,
  type,
  disabled,
  meta: { touched, error, submitting }
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} disabled={submitting} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

const onSubmitReduxSaga = (data, dispatch, props) => {
  return {
    type: 'FORM_SAGA',
    payload: data
  }
}

const onSubmitReduxEpic = (data, dispatch, props) => {
  return {
    type: 'FORM_EPIC',
    payload: data
  }
}

const RemoteSubmitForm = props => {
  const { error, handleSubmit, submitting } = props

  return (
    <form>
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
      <div>
        <button
          type="button"
          style={style}
          onClick={handleSubmit(onSubmitReduxSaga)}
          disabled={submitting}
        >
          Submit To Redux Saga
        </button>
        <button
          type="button"
          style={style}
          onClick={handleSubmit(onSubmitReduxEpic)}
          disabled={submitting}
        >
          Submit To Redux Observable
        </button>
      </div>
    </form>
  )
}

export const FORM_NAME = 'dispatchSubmit'

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  }
  return errors
}

export default reduxForm({
  form: FORM_NAME, // a unique identifier for this form // submit function must be passed to onSubmit
  submitAsSideEffect: true,
  validate
})(RemoteSubmitForm)
