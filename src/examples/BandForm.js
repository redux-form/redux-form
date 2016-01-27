import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['id', 'name', 'color'];

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.color) {
    errors.color = 'Required';
  } else if (!/^[0-9A-F]{6}$/i.test(values.color)) {
    errors.color = 'Invalid color';
  }
  return errors;
};

class BandForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  render() {
    const {
      fields: {name, color},
      handleSubmit,
      pristine,
      resetForm,
      submitting
      } = this.props;
    return (<form style={{display: 'flex'}} onSubmit={handleSubmit}>
        <div style={{flex: 1}} className={'form-group' + (name.touched && name.error ? ' has-error' : '')}>
          <input type="text" className="form-control"
                 style={{display: 'inline', width: name.touched && name.error ? '50%' : '100%'}}
                 placeholder="Band" {...name}/>
          {name.touched && name.error &&
          <div style={{width: '50%', display: 'inline', paddingLeft: 10}} className="help-block">{name.error}</div>}
        </div>
        <div style={{flex: 1}} className={'form-group' + (color.touched && color.error ? ' has-error' : '')}>
          <input type="text" className="form-control"
                 style={{display: 'inline', width: color.touched && color.error ? '50%' : '100%'}}
                 placeholder="Favorite Color" {...color}/>
          {color.touched && color.error &&
          <div style={{width: '50%', display: 'inline', paddingLeft: 10}} className="help-block">{color.error}</div>}
        </div>
        <button type="submit" style={{width: 92, height: 34}} className="btn btn-primary" disabled={pristine || submitting}>
          {submitting ? <i className="fa fa-cog fa-spin"/> : <i className="fa fa-paper-plane"/>} Submit
        </button>
        <button type="button" style={{width: 72, height: 34}} className="btn btn-default" disabled={pristine || submitting} onClick={resetForm}>
          Cancel
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'band',
  fields,
  validate
})(BandForm);
