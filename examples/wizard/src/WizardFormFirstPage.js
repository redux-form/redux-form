import React from 'react'
import { Field, reduxForm } from 'redux-form'
const  { DOM: { input } } = React
const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  return errors
}
const WizardFormFirstPage = (props) => {
  const { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
          <Field name="firstName" component = {firstName => 
            <div>
              <input type="text" {...firstName} placeholder="First Name"/>
              {firstName.touched && firstName.error && <span>{firstName.error}</span>}
            </div>
          } />
      </div>
     <div>
        <label>Last Name</label>
          <Field name="lastName" component = {lastName => 
            <div>
              <input type="text" {...lastName} placeholder="last Name"/>
              {lastName.touched && lastName.error && <span>{lastName.error}</span>}
            </div>
          } />
      </div>
      <div>
        <button type="submit">
          Next <i className="fa fa-chevron-right"/>
        </button>
      </div>
    </form>
  ) 
}

export default reduxForm({
  form: 'wizard',              // <------ same form name
  destroyOnUnmount: false,     // <------ preserve form data
  validate
})(WizardFormFirstPage)
