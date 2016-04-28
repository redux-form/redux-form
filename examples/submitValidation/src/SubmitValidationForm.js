import React from 'react'
import { Field, reduxForm } from 'redux-form'

const SubmitValidationForm = (props) => {
  const { error, handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <Field name="username" component={username =>
          <div>
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
      {error && <strong>{error}</strong>}
      <div>
        <button type="submit" disabled={submitting}>Log In</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'submitValidation'  // a unique identifier for this form
})(SubmitValidationForm)
