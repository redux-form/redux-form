import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['firstName', 'lastName', 'email', 'sex', 'favoriteColor', 'employed', 'notes'];
// ^^ All fields on last form

const validate = values => {
  const errors = {};
  if (!values.favoriteColor) {
    errors.favoriteColor = 'Required';
  }
  return errors;
};

class WizardFormThirdPage extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    previousPage: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      fields: {favoriteColor, employed, notes},
      handleSubmit,
      previousPage,
      submitting
      } = this.props;
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-xs-4 control-label">Favorite Color</label>
          <div className={'col-xs-' + (favoriteColor.touched && favoriteColor.error ? '5' : '8')}>
            <select className="form-control" {...favoriteColor} value={favoriteColor.value || ''}>
              <option></option>
              <option value="ff0000">Red</option>
              <option value="00ff00">Green</option>
              <option value="0000ff">Blue</option>
            </select>
          </div>
          {favoriteColor.touched && favoriteColor.error && <div className="col-xs-3 help-block">{favoriteColor.error}</div>}
        </div>
        <div className="form-group">
          <label className="col-xs-8 col-xs-offset-4 checkbox-inline">
            <input type="checkbox" {...employed}/> Employed
          </label>
        </div>
        <div className="form-group">
          <label className="col-xs-4 control-label">Notes</label>
          <div className="col-xs-8">
            <textarea className="form-control" {...notes} value={notes.value || ''}/>
          </div>
        </div>
        <div className="text-center">
          <button type="button" className="btn btn-default btn-lg" style={{margin: 10}} disabled={submitting} onClick={previousPage}>
            <i className="fa fa-chevron-left"/> Previous
          </button>
          <button type="submit" className="btn btn-primary btn-lg" style={{margin: 10}} disabled={submitting}>
            {submitting ? <i className="fa fa-cog fa-spin"/> : <i className="fa fa-paper-plane"/>} Finish
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'wizard',              // <------ same form name
  fields,                      // <------ all fields on last wizard page
  destroyOnUnmount: false,     // <------ preserve form data
  validate                     // <------ only validates the fields on this page
})(WizardFormThirdPage);
