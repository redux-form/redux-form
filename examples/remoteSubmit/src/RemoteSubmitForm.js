import React from 'react'
import { Field, reduxForm } from 'redux-form'
import submit from './submit'

const style = {
  padding: '10px 20px',
  width: 140,
  display: 'block',
  margin: '20px auto',
  fontSize: '16px'
}

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
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
  const { error, handleSubmit } = props
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
      <button
        type="button"
        style={style}
        onClick={handleSubmit(onSubmitReduxSaga)}
      >
        Submit To Redux Saga
      </button>
      <button
        type="button"
        style={style}
        onClick={handleSubmit(onSubmitReduxEpic)}
      >
        Submit To Redux Observable
      </button>
    </form>
  )
}

export default reduxForm({
  form: 'remoteSubmit', // a unique identifier for this form // submit function must be passed to onSubmit
  submitAsSideEffect: true
})(RemoteSubmitForm)
