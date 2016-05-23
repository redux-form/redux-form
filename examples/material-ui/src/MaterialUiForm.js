import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { RadioButton } from 'material-ui/RadioButton'
import MenuItem from 'material-ui/MenuItem'
import asyncValidate from './asyncValidate'
import adapter from 'redux-form-material-ui'

const validate = values => {
  const errors = {}
  const requiredFields = [ 'firstName', 'lastName', 'email', 'favoriteColor', 'notes' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  return errors
}

const MaterialUiForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field name="firstName"
          component="TextField"
          hintText="First Name"
          floatingLabelText="First Name"/>
      </div>
      <div>
        <Field
          name="lastName"
          component="TextField"
          hintText="Last Name"
          floatingLabelText="Last Name"/>
      </div>
      <div>
        <Field
          name="email"
          component="TextField"
          hintText="Email"
          floatingLabelText="Email"/>
      </div>
      <div>
        <Field name="sex" component="RadioButtonGroup">
          <RadioButton value="male" label="Male"/>
          <RadioButton value="female" label="Female"/>
        </Field>
      </div>
      <div>
        <Field
          name="favoriteColor"
          component="SelectField"
          hintText="Favorite Color"
          floatingLabelText="Favorite Color">
          <MenuItem value={'ff0000'} primaryText="Red"/>
          <MenuItem value={'00ff00'} primaryText="Green"/>
          <MenuItem value={'0000ff'} primaryText="Blue"/>
        </Field>
      </div>
      <div>
        <Field name="employed" component="Checkbox" label="Employed"/>
      </div>
      <div>
        <Field name="married" component="Toggle" label="Married" labelPosition="right"/>
      </div>
      <div>
        <Field
          name="notes"
          component="TextField"
          hintText="Notes"
          floatingLabelText="Notes"
          multiLine={true}
          rows={2}/>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'MaterialUiForm',  // a unique identifier for this form
  adapter,
  validate,
  asyncValidate
})(MaterialUiForm)
