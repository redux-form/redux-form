import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import Address from './Address';
export const fields = [
  'name',
  'shipping.street',
  'shipping.city',
  'billing.street',
  'billing.city',
  'children[].name',
  'children[].age'
];

class DeepForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  };

  render() {
    const {
      fields: {name, shipping, billing, children},
      handleSubmit,
      resetForm
      } = this.props;
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-xs-4 control-label">Name</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="Name" {...name}/>
          </div>
        </div>
        <h4>Shipping</h4>
        <Address {...shipping}/>
        <h4>Billing</h4>
        <Address {...billing}/>
        {!children.length && <div>No Children</div>}
        <button onClick={() => children.push()}>Add Child</button>
        {children.forEach((child, index) => <div className="form-group" key={index}>
          <label className="col-xs-4 control-label">Child #{index + 1}</label>
          <div className="col-xs-8">
            <input type="text" className="form-control" placeholder="Child" {...child}/>
          </div>
        </div>)}
        <div className="text-center">
          <button className="btn btn-primary btn-lg" style={{margin: 10}} onClick={handleSubmit}>Submit</button>
          <button className="btn btn-default btn-lg" style={{margin: 10}} onClick={resetForm}>Clear Values</button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'deep',
  fields
})(DeepForm);
