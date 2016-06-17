import { Component, PropTypes, createElement } from 'react'
import invariant from 'invariant'
import createConnectedFieldArray from './ConnectedFieldArray'
import shallowCompare from 'react-addons-shallow-compare'
import plain from './structure/plain'

const getSyncError = (context, name) => {
  const { _reduxForm: { syncErrors } } = context
  // For an array, the error can _ONLY_ be under _error.
  // This is why this getSyncError is not the same as the
  // one in Field.
  return plain.getIn(syncErrors, `${name}._error`)
}

const createFieldArray = ({ deepEqual, getIn, size }) => {

  class FieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()')
      }
      this.ConnectedFieldArray =
        createConnectedFieldArray(context._reduxForm, { deepEqual, getIn, size }, props.name)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      const nextSyncError = getSyncError(nextContext, nextProps.name)
      return shallowCompare(this, nextProps, nextState) || this.syncError !== nextSyncError
    }

    componentWillMount() {
      this.context._reduxForm.register(this.name, 'FieldArray')
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // name changed, regenerate connected field
        this.ConnectedFieldArray =
          createConnectedFieldArray(this.context._reduxForm, {
            deepEqual,
            getIn,
            size
          }, nextProps.name)
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.name)
    }

    get syncError() {
      return getSyncError(this.context, this.props.name)
    }
    
    get name() {
      return this.props.name
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
      return createElement(this.ConnectedFieldArray, {
        ...this.props,
        syncError: this.syncError,
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
