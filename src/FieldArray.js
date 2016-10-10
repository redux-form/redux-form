import { Component, PropTypes, createElement } from 'react'
import invariant from 'invariant'
import createConnectedFieldArray from './ConnectedFieldArray'
import shallowCompare from './util/shallowCompare'
import prefixName from './util/prefixName'

const createFieldArray = ({ deepEqual, getIn, size }) => {

  const ConnectedFieldArray = createConnectedFieldArray({ deepEqual, getIn, size })

  class FieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()')
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }

    componentWillMount() {
      this.context._reduxForm.register(this.name, 'FieldArray')
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // unregister old name
        this.context._reduxForm.unregister(this.name)
        // register new name
        this.context._reduxForm.register(prefixName(this.context, nextProps.name), 'FieldArray')
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.name)
    }

    get name() {
      return prefixName(this.context, this.props.name)
    }

    get dirty() {
      return this.refs.connected.getWrappedInstance().dirty
    }

    get pristine() {
      return this.refs.connected.getWrappedInstance().pristine
    }

    get value() {
      return this.refs.connected.getWrappedInstance().value
    }

    getRenderedComponent() {
      invariant(this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
        'you must specify a withRef prop to FieldArray')
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    render() {
      return createElement(ConnectedFieldArray, {
        ...this.props,
        name: this.name,
        syncError: this.syncError,
        syncWarning: this.syncWarning,
        _reduxForm: this.context._reduxForm,
        ref: 'connected'
      })
    }
  }

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
    props: PropTypes.object
  }
  FieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return FieldArray
}

export default createFieldArray
