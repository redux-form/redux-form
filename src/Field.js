import React, { Component, PropTypes } from 'react'
import invariant from 'invariant'
import createConnectedField from './ConnectedField'

let keys = 0
const generateKey = () => `redux-form-field-${keys++}`

const createField = ({ deepEqual, getIn }) => {

  class Field extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('Field must be inside a component decorated with reduxForm()')
      }
      this.key = generateKey()
      this.ConnectedField = createConnectedField(context._reduxForm, { deepEqual, getIn }, props.name)
    }

    shouldComponentUpdate(nextProps) {
      return this.props.name !== nextProps.name
    }

    componentWillMount() {
      this.context._reduxForm.register(this.key, this)
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // name changed, regenerate connected field
        this.ConnectedField =
          createConnectedField(this.context._reduxForm, { deepEqual, getIn }, nextProps.name)
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.key)
    }

    get valid() {
      return this.refs.connected.getWrappedInstance().valid
    }

    getRenderedComponent() {
      invariant(this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
        'you must specify a withRef prop to Field')
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    get name() {
      return this.props.name
    }

    render() {
      const { ConnectedField } = this
      return <ConnectedField {...this.props} ref="connected"/>
    }
  }

  Field.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any
  }
  Field.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return Field
}

export default createField
