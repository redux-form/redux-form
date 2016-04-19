import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable' // <--- immutable import
const { DOM: { input } } = React

const ImmutableForm = (props) => {
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
  form: 'immutableExample'  // a unique identifier for this form
})(ImmutableForm)
