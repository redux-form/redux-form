import React, { Component, PropTypes } from 'react'
import createConnectedFieldArray from './ConnectedFieldArray'

let keys = 0
const generateKey = () => `redux-form-field-${keys++}`

const createFieldArray = ({ deepEqual, getIn, size }) => {

  class FieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()')
      }
      this.key = generateKey()
      this.ConnectedFieldArray = createConnectedFieldArray(context._reduxForm, { deepEqual, getIn, size }, props.name)
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // name changed, regenerate connected field
        this.ConnectedFieldArray =
          createConnectedFieldArray(this.context._reduxForm, getIn, nextProps.name)
      }
    }

    get valid() {
      return this.refs.connected.getWrappedInstance().valid
    }

    get name() {
      return this.props.name
    }

    render() {
      const { ConnectedFieldArray } = this
      return <ConnectedFieldArray {...this.props} ref="connected"/>
    }
  }

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired
  }
  FieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return FieldArray
}

export default createFieldArray
