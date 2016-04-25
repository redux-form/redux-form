import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
const  { DOM: { input } } = React

const WizardFormSecondPage = (props) => {
  const { handleSubmit, previousPage } = props
  return (
    <form onSubmit={handleSubmit}>
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
        <label>Sex</label>
        <div>
          <label><Field name="sex" component={input} type="radio" value="male"/> Male</label>
          <label><Field name="sex" component={input} type="radio" value="female"/> Female</label>
          <Field name="sex" component={sex => sex.touched && sex.error ? <span>{sex.error}</span> : null}/>
        </div>
      </div>
      <div>
        <button type="button" className="previous" onClick={previousPage}>Previous</button>
        <button type="submit" className="next">Next</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'wizard',  //Form name is same
  destroyOnUnmount: false,
  validate
})(WizardFormSecondPage)
