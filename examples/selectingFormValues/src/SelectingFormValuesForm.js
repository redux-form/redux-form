import React from 'react'
import {connect} from 'react-redux'
import {Field, reduxForm, formValueSelector} from 'redux-form'

let SelectingFormValuesForm = props => {
  const {
    favoriteColorValue,
    fullName,
    handleSubmit,
    hasEmailValue,
    pristine,
    reset,
    submitting
  } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <div>
          <Field
            name="firstName"
            component="input"
            type="text"
            placeholder="First Name"
          />
        </div>
      </div>
      <div>
        <label>Last Name</label>
        <div>
          <Field
            name="lastName"
            component="input"
            type="text"
            placeholder="Last Name"
          />
        </div>
      </div>
      <div>
        <label htmlFor="hasEmail">Has Email?</label>
        <div>
          <Field
            name="hasEmail"
            id="hasEmail"
            component="input"
            type="checkbox"
          />
        </div>
      </div>
      {hasEmailValue &&
        <div>
          <label>Email</label>
          <div>
            <Field
              name="email"
              component="input"
              type="email"
              placeholder="Email"
            />
          </div>
        </div>}
      <div>
        <label>Favorite Color</label>
        <div>
          <Field name="favoriteColor" component="select">
            <option />
            <option value="#ff0000">Red</option>
            <option value="#00ff00">Green</option>
            <option value="#0000ff">Blue</option>
          </Field>
        </div>
      </div>
      {favoriteColorValue &&
        <div
          style={{
            height: 80,
            width: 200,
            margin: '10px auto',
            backgroundColor: favoriteColorValue
          }}
        />}
      <div>
        <button type="submit" disabled={pristine || submitting}>
          Submit {fullName}
        </button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </button>
      </div>
    </form>
  )
}

// The order of the decoration does not matter.

// Decorate with redux-form
SelectingFormValuesForm = reduxForm({
  form: 'selectingFormValues' // a unique identifier for this form
})(SelectingFormValuesForm)

// Decorate with connect to read form values
const selector = formValueSelector('selectingFormValues') // <-- same as form name
SelectingFormValuesForm = connect(state => {
  // can select values individually
  const hasEmailValue = selector(state, 'hasEmail')
  const favoriteColorValue = selector(state, 'favoriteColor')
  // or together as a group
  const {firstName, lastName} = selector(state, 'firstName', 'lastName')
  return {
    hasEmailValue,
    favoriteColorValue,
    fullName: `${firstName || ''} ${lastName || ''}`
  }
})(SelectingFormValuesForm)

export default SelectingFormValuesForm
