import React, { Component, PropTypes } from 'react'
import { reduxForm, addArrayValue } from 'redux-form'
import Address from './Address'
import PureInput from '../components/PureInput'
import validate from './validateDeepForm'
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
]

class DeepForm extends Component {
  render() {
    const {
      addValue,
      fields: { name, shipping, billing, children },
      handleSubmit,
      resetForm,
      invalid,
      submitting
    } = this.props
    return (<form className="form-horizontal" onSubmit={handleSubmit}>
        <div style={{ textAlign: 'right', marginBottom: 10 }}>
          <button type="button" className="btn btn-danger" onClick={() => {
            for (let childIndex = 0; childIndex < 30; childIndex++) {
              addValue('deep', 'children')
              for (let awardIndex = 0; awardIndex < 10; awardIndex++) {
                addValue('deep', `children[${childIndex}].awards`)
              }
            }
          }}><i className="fa fa-bomb"/> Make Form Enormous!</button>
        </div>
        <div className="form-group">
          <label className="col-xs-2 control-label">Name</label>
          <div className="col-xs-10">
            <PureInput type="text" className="form-control" placeholder="Name" field={name} title={name.error}/>
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
        <div style={{ textAlign: 'center', margin: 10 }}>
          <button type="button" className="btn btn-success" onClick={() => {
            children.addField()    // pushes empty child field onto the end of the array
          }}><i className="fa fa-child"/> Add Child
          </button>
          <button type="button" style={{ marginLeft: 15 }} className="btn btn-success" onClick={() => {
            children.addField({     // pushes child field with initial values onto the end of the array
              name: 'Bobby Tables',
              age: 13,
              awards: [ 'Input Sanitation', 'Best XKCD Meme' ]
            })
          }}><i className="fa fa-child"/> Add Bobby
          </button>
        </div>
        {!children.length && <div style={{ textAlign: 'center', margin: 10 }}>No Children</div>}
        {children.map((child, index) => <div key={index}>
          <div className="form-group">
            <label className="col-xs-2 control-label">Child #{index + 1}</label>
            <div className="col-xs-4">
              <PureInput type="text" className="form-control" placeholder="Child Name" field={child.name}/>
            </div>
            <div className="col-xs-2">
              <PureInput type="text" className="form-control" placeholder="Child Age" field={child.age}/>
            </div>
            <div className="col-xs-4 btn-toolbar">
              <button type="button" className="btn btn-success" onClick={() => {
                child.awards.addField()  // pushes empty award field onto the end of the array
              }}><i className="fa fa-trophy"/> Add Award
              </button>
              <div className="btn-group">
                <button type="button" className="btn btn-success" disabled={index === 0} onClick={() => {
                  children.swapFields(index, index - 1)  // swap field with it's predecessor
                }}><i className="fa fa-caret-up"/>
                </button>
                <button type="button" className="btn btn-success" disabled={index === children.length - 1} onClick={() => {
                  children.swapFields(index, index + 1)  // swap field with it's successor
                }}><i className="fa fa-caret-down"/>
                </button>
              </div>
              <button type="button" className="btn btn-danger" onClick={() => {
                children.removeField(index)  // remove from index
              }}><i className="fa fa-trash"/> Remove
              </button>
            </div>
          </div>
          {child.awards.map((award, awardIndex) => <div key={awardIndex}>
            <div className="form-group">
              <label className="col-xs-2 col-xs-offset-2 control-label">Award #{awardIndex + 1}</label>
              <div className="col-xs-6">
                <PureInput type="text" className="form-control" placeholder="Award" field={award}/>
              </div>
              <div className="col-xs-2">
                <button type="button" className="btn btn-danger" onClick={() => {
                  child.awards.removeField(awardIndex) // remove from awardIndex
                }}><i className="fa fa-trash"/></button>
              </div>
            </div>
          </div>)}
        </div>)}
        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg" style={{ margin: 10 }} disabled={submitting || invalid}>
            {submitting ? <i className="fa fa-cog fa-spin"/> : <i className="fa fa-paper-plane"/>} Submit
          </button>
          <button type="button" className="btn btn-default btn-lg" style={{ margin: 10 }} disabled={submitting} onClick={resetForm}>
            Clear Values
          </button>
        </div>
      </form>
    )
  }
}

DeepForm.propTypes = {
  addValue: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'deep',
  fields,
  validate
}, undefined, {
  addValue: addArrayValue // mapDispatchToProps (will bind action creator to dispatch)
})(DeepForm)
