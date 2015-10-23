import React from 'react';
import {reduxForm} from 'redux-form';
export const fields = ['name', 'color'];

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

const BandForm = props => {
  const {
    fields: {name, color},
    handleSubmit,
    onCancel  // passed in from BandsForm
  } = props;
  return (<form className="form-inline" onSubmit={handleSubmit}>
      <div className={'form-group' + (name.touched && name.error ? ' has-error' : '')}>
        <div className={'col-xs-' + (name.touched && name.error ? '3' : '5')}>
          <input type="text" className="form-control" placeholder="Band" {...name}/>
        </div>
        {name.touched && name.error && <div className="col-xs-2 help-block">{name.error}</div>}
      </div>
      <div className={'form-group' + (color.touched && color.error ? ' has-error' : '')}>
        <div className={'col-xs-' + (color.touched && color.error ? '3' : '5')}>
          <input type="text" className="form-control" placeholder="Favorite Color" {...color}/>
        </div>
        {color.touched && color.error && <div className="col-xs-2 help-block">{color.error}</div>}
      </div>
      <div className="col-xs-2 text-center">
        <button className="btn btn-primary" style={{margin: 10}} onClick={handleSubmit}>Submit</button>
        <button className="btn btn-default" style={{margin: 10}} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'band',
  fields,
  validate
})(BandForm);
