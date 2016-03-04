import React from 'react'
import { reduxForm } from 'redux-form'
export const fields = [
  'firstName', 'lastName', 'email', 'sex', 'favoriteColor', 'employed', 'notes'
]

const SimpleForm = ({
  fields: { firstName, lastName, email, sex, favoriteColor, employed, notes },
  handleSubmit,
  resetForm,
  submitting
  }) =>
  <form className="form-horizontal" onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="col-xs-4 control-label">First Name</label>
      <div className="col-xs-8">
        <input type="text" className="form-control" placeholder="First Name" {...firstName}/>
      </div>
    </div>
    <div className="form-group">
      <label className="col-xs-4 control-label">Last Name</label>
      <div className="col-xs-8">
        <input type="text" className="form-control" placeholder="Last Name" {...lastName}/>
      </div>
    </div>
    <div className="form-group">
      <label className="col-xs-4 control-label">Email</label>
      <div className="col-xs-8">
        <input type="email" className="form-control" placeholder="Email" {...email}/>
      </div>
    </div>
    <div className="form-group">
      <label className="col-xs-4 control-label">Sex</label>
      <div className="col-xs-8">
        <label className="radio-inline">
          <input type="radio" {...sex} value="male" checked={sex.value === 'male'}/> Male
        </label>
        <label className="radio-inline">
          <input type="radio" {...sex} value="female" checked={sex.value === 'female'}/> Female
        </label>
      </div>
    </div>
    <div className="form-group">
      <label className="col-xs-4 control-label">Favorite Color</label>
      <div className="col-xs-8">
        <select className="form-control"
          {...favoriteColor}
          value={favoriteColor.value || ''}  // required syntax for reset form to work
          // undefined will not change value to first empty option
          // when resetting
        >
          <option></option>
          <option value="ff0000">Red</option>
          <option value="00ff00">Green</option>
          <option value="0000ff">Blue</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="col-xs-8 col-xs-offset-4 checkbox-inline">
        <input type="checkbox" {...employed}/> Employed
      </label>
    </div>
    <div className="form-group">
      <label className="col-xs-4 control-label">Notes</label>
      <div className="col-xs-8">
            <textarea className="form-control"
              {...notes}
              value={notes.value || ''} // required for reset form to work (only on textarea's)
              // see: https://github.com/facebook/react/issues/2533
            />
      </div>
    </div>
    <div className="text-center">
      <button type="submit" className="btn btn-primary btn-lg" style={{ margin: 10 }} disabled={submitting}>
        {submitting ? <i className="fa fa-cog fa-spin"/> : <i className="fa fa-paper-plane"/>}
        Submit
      </button>
      <button type="button" className="btn btn-default btn-lg" style={{ margin: 10 }} disabled={submitting} onClick={resetForm}>
        Clear Values
      </button>
    </div>
  </form>

export default reduxForm({
  form: 'simple',
  fields
})(SimpleForm)
