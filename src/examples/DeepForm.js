import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import Address from './Address';
export const fields = [
  'name',
  'shipping.street',
  'shipping.city',
  'shipping.phones[]',
  'billing.street',
  'billing.city',
  'billing.phones[]',
  'children[].name',
  'children[].age',
  'children[].awards[]'
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
          <label className="col-xs-2 control-label">Name</label>
          <div className="col-xs-10">
            <input type="text" className="form-control" placeholder="Name" {...name}/>
          </div>
        </div>
        <div className="row">
          <fieldset className="col-xs-12 col-sm-6">
            <legend>Shipping</legend>
            <Address {...shipping}/>
          </fieldset>
          <fieldset className="col-xs-12 col-sm-6">
            <legend>Billing</legend>
            <Address {...billing}/>
          </fieldset>
        </div>
        <div style={{textAlign: 'center', margin: 10}}>
          <button className="btn btn-success" onClick={event => {
            event.preventDefault(); // prevent form submission
            children.addField();    // pushes empty child field onto the end of the array
          }}><i className="fa fa-child"/> Add Child</button>
        </div>
        {!children.length && <div style={{textAlign: 'center', margin: 10}}>No Children</div>}
        {children.map((child, index) => <div key={index}>
          <div className="form-group">
            <label className="col-xs-2 control-label">Child #{index + 1}</label>
            <div className="col-xs-4">
              <input type="text" className="form-control" placeholder="Child Name" {...child.name}/>
            </div>
            <div className="col-xs-2">
              <input type="text" className="form-control" placeholder="Child Age" {...child.age}/>
            </div>
            <div className="col-xs-2">
              <button className="btn btn-success" onClick={event => {
                event.preventDefault();   // prevent form submission
                child.awards.addField();  // pushes empty award field onto the end of the array
              }}><i className="fa fa-trophy"/> Add Award
              </button>
            </div>
            <div className="col-xs-2">
              <button className="btn btn-danger" onClick={event => {
                event.preventDefault();       // prevent form submission
                children.removeField(index);  // remove from index
              }}><i className="fa fa-trash"/> Remove</button>
            </div>
          </div>
          {child.awards.map((award, awardIndex) => <div key={awardIndex}>
            <div className="form-group">
              <label className="col-xs-2 col-xs-offset-2 control-label">Award #{awardIndex + 1}</label>
              <div className="col-xs-6">
                <input type="text" className="form-control" placeholder="Award" {...award}/>
              </div>
              <div className="col-xs-2">
                <button className="btn btn-danger" onClick={event => {
                  event.preventDefault();               // prevent form submission
                  child.awards.removeField(awardIndex); // remove from awardIndex
                }}><i className="fa fa-trash"/></button>
              </div>
            </div>
          </div>)}
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
