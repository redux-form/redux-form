import React from 'react'
import { Field, reduxForm } from 'redux-form'
const { DOM: { input } } = React
import validate from './validate'
import asyncValidate from './asyncValidate'

const AsyncValidationForm = (props) => {
  const { asyncValidating, handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <Field name="username" component={username =>
          <div className={asyncValidating === 'username' ? 'async-validating' : ''}>
            <input type="text" {...username} placeholder="Username"/>
            {username.touched && username.error && <span>{username.error}</span>}
          </div>
        }/>
      </div>
      <div>
        <label>Password</label>
        <Field name="password" component={password =>
          <div>
            <input type="password" {...password} placeholder="Password"/>
            {password.touched && password.error && <span>{password.error}</span>}
          </div>
        }/>
      </div>
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
  asyncValidate
})(AsyncValidationForm)
