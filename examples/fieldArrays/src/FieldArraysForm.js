import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import validate from './validate'

const renderField = props => (
  <div>
    <label>{props.placeholder}</label>
    <div>
      <input {...props}/>
      {props.touched && props.error && <span>{props.error}</span>}
    </div>
  </div>
)

const renderMembers = members => (
  <ul>
    <li>
      <button type="button" onClick={() => members.push({})}>Add Member</button>
    </li>
    {members.map((member, memberIndex) =>
      <li key={memberIndex}>
        <button
          type="button"
          title="Remove Member"
          onClick={() => members.remove(memberIndex)}/>
        <h4>Member #{memberIndex + 1}</h4>
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

const renderHobbies = hobbies => (
  <ul>
    <li>
      <button type="button" onClick={() => hobbies.push()}>Add Hobby</button>
    </li>
    {hobbies.map((hobby, hobbyIndex) =>
      <li key={hobbyIndex}>
        <button
          type="button"
          title="Remove Hobby"
          onClick={() => hobbies.remove(hobbyIndex)}/>
        <Field
          name={hobby}
          type="text"
          component={renderField}
          placeholder={`Hobby #${hobbyIndex + 1}`}/>
      </li>
    )}
    {hobbies.error && <li className="error">{hobbies.error}</li>}
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
