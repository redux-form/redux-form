import React from 'react'
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/lib/text-field'
import RadioButton from 'material-ui/lib/radio-button'
import RadioButtonGroup from 'material-ui/lib/radio-button-group'
import Checkbox from 'material-ui/lib/checkbox'
import SelectField from 'material-ui/lib/select-field'
import MenuItem from 'material-ui/lib/menus/menu-item'
import asyncValidate from './asyncValidate'

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

const renderTextField = props => (
  <TextField hintText={props.label}
    floatingLabelText={props.label}
    errorText={props.touched && props.error}
    {...props}
  />
)

const renderCheckbox = props => (
  <Checkbox label={props.label}
    checked={props.value ? true : false}
    onCheck={props.onChange}/>
)

const renderSelectField = props => (
  <SelectField
    floatingLabelText={props.label}
    errorText={props.touched && props.error}
    {...props}
    onChange={(event, index, value) => props.onChange(value)}>
  </SelectField>
)

const MaterialUiForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field name="firstName" component={renderTextField} label="First Name"/>
      </div>
      <div>
        <Field name="lastName" component={renderTextField} label="Last Name"/>
      </div>
      <div>
        <Field name="email" component={renderTextField} label="Email"/>
      </div>
      <div>
        <Field name="sex" component={RadioButtonGroup}>
          <RadioButton value="male" label="male"/>
          <RadioButton value="female" label="female"/>
        </Field>
      </div>
      <div>
        <Field name="favoriteColor" component={renderSelectField} label="Favorite Color">
          <MenuItem value={'ff0000'} primaryText="Red"/>
          <MenuItem value={'00ff00'} primaryText="Green"/>
          <MenuItem value={'0000ff'} primaryText="Blue"/>
        </Field>
      </div>
      <div>
        <Field name="employed" component={renderCheckbox} label="Employed"/>
      </div>
      <div>
        <Field name="notes" component={renderTextField} label="Notes" multiLine={true} rows={2}/>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'MaterialUiForm',  // a unique identifier for this form
  validate,
  asyncValidate
})(MaterialUiForm)
