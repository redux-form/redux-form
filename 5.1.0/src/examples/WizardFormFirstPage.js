import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
export const fields = [ 'firstName', 'lastName' ]

const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  } else if (values.firstName.length > 15) {
    errors.firstName = 'Must be 15 characters or less'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  } else if (values.lastName.length > 15) {
    errors.lastName = 'Must be 15 characters or less'
  }
  return errors
}

class WizardFormFirstPage extends Component {
  render() {
    const {
      fields: { firstName, lastName },
      handleSubmit
    } = this.props
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-xs-4 control-label">First Name</label>
          <div className={'col-xs-' + (firstName.touched && firstName.error ? '5' : '8')}>
            <input type="text" className="form-control" placeholder="First Name" {...firstName}/>
          </div>
          {firstName.touched && firstName.error && <div className="col-xs-3 help-block">{firstName.error}</div>}
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Last Name</label>
          <div className={'col-xs-' + (lastName.touched && lastName.error ? '5' : '8')}>
            <input type="text" className="form-control" placeholder="Last Name" {...lastName}/>
          </div>
          {lastName.touched && lastName.error && <div className="col-xs-3 help-block">{lastName.error}</div>}
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg" style={{ margin: 10 }}>
            Next <i className="fa fa-chevron-right"/>
          </button>
        </div>
      </form>
    )
  }
}

WizardFormFirstPage.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'wizard',              // <------ same form name
  fields,                      // <------ only fields on this page
  destroyOnUnmount: false,     // <------ preserve form data
  validate                     // <------ only validates the fields on this page
})(WizardFormFirstPage)
