import React from 'react'
import { Field, reduxForm } from 'redux-form'
const { DOM: { input } } = React

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less'
  }
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.age) {
    errors.age = 'Required'
  } else if (isNaN(Number(values.age))) {
    errors.age = 'Must be a number'
  } else if (Number(values.age) < 18) {
    errors.age = 'Sorry, you must be at least 18 years old'
  }
  return errors
}

const SyncValidationForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
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
        <label>Email</label>
        <Field name="email" component={email =>
          <div>
            <input type="email" {...email} placeholder="Email"/>
            {email.touched && email.error && <span>{email.error}</span>}
          </div>
        }/>
      </div>
      <div>
        <label>Age</label>
        <Field name="age" component={age =>
          <div>
            <input type="number" {...age} placeholder="Age"/>
            {age.touched && age.error && <span>{age.error}</span>}
          </div>
        }/>
      </div>
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
