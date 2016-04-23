import React from 'react'
import { Field, reduxForm } from 'redux-form'
const  { DOM: { input } } = React
const validate = values => {
  let errors = {}
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.sex) {
    errors.sex = 'Required'
  }
  return errors
}
/* This is simple statelss component given to Field */
const sex = (sex) => 
  <div>
    <label><input type="radio" {...sex} value="male"/>Male</label>
    <label><input type="radio" {...sex} value="female"/>Female</label>
    {sex.touched && sex.error && <span>{sex.error}</span>}
  </div>

const WizardFormSecondPage = (props) => {
  const { handleSubmit, previousPage } = props
  return (
    <form onSubmit={handleSubmit}>
        <div>
        <label>Email</label>
          <Field name="email" component = {email => 
            <div>
              <input type="email" {...email} placeholder="Email"/>
              {email.touched && email.error && <span>{email.error}</span>}
            </div>
          } />
      </div>
      <div>
        <label>Sex</label>
        <Field name="sex" component={sex} />
      </div>
      <div>
        <button type="button" className="btn btn-default btn-lg" onClick={previousPage}>
          <i className="fa fa-chevron-left"/>Previous
        </button>
        <button type="submit">
          <i className="fa fa-chevron-right"/>Next
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'wizard',  //Form name is same
  destroyOnUnmount: false,
  validate
})(WizardFormSecondPage)
