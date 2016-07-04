import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import validate from './validate'

const renderField = field => (
  <div>
    <label>{field.input.placeholder}</label>
    <div>
      <input {...field.input}/>
      {field.touched && field.error && <span>{field.error}</span>}
    </div>
  </div>
)

const renderMembers = ({ fields }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push({})}>Add Member</button>
    </li>
    {fields.map((member, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Member"
          onClick={() => fields.remove(index)}/>
        <h4>Member #{index + 1}</h4>
        <Field
          name={`${member}.firstName`}
          type="text"
          component={renderField}
          placeholder="First Name"/>
        <Field
          name={`${member}.lastName`}
          type="text"
          component={renderField}
          placeholder="Last Name"/>
        <FieldArray name={`${member}.hobbies`} component={renderHobbies}/>
      </li>
    )}
  </ul>
)

const renderHobbies = ({ fields }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push()}>Add Hobby</button>
    </li>
    {fields.map((hobby, index) =>
      <li key={index}>
        <button
          type="button"
          title="Remove Hobby"
          onClick={() => fields.remove(index)}/>
        <Field
          name={hobby}
          type="text"
          component={renderField}
          placeholder={`Hobby #${index + 1}`}/>
      </li>
    )}
    {fields.error && <li className="error">{fields.error}</li>}
  </ul>
)

const FieldArraysForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="clubName" type="text" component={renderField} placeholder="Club Name"/>
      <FieldArray name="members" component={renderMembers}/>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'fieldArrays',     // a unique identifier for this form
  validate
})(FieldArraysForm)
