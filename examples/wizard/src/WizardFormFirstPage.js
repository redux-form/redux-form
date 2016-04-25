import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
const  { DOM: { input } } = React

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
              <input type="text" {...lastName} placeholder="Last Name"/>
              {lastName.touched && lastName.error && <span>{lastName.error}</span>}
            </div>
          } />
      </div>
      <div>
        <button type="submit" className="next">Next</button>
      </div>
    </form>
  ) 
}

export default reduxForm({
  form: 'wizard',              // <------ same form name
  destroyOnUnmount: false,     // <------ preserve form data
  validate
})(WizardFormFirstPage)
