import { Component, PropTypes, createElement } from 'react'
import invariant from 'invariant'
import createConnectedField from './ConnectedField'
import shallowCompare from 'react-addons-shallow-compare'
import plain from './structure/plain'

const getSyncError = (context, name) => {
  const { _reduxForm: { syncErrors } } = context
  const error = plain.getIn(syncErrors, name)
  // Because the error for this field might not be at a level in the error structure where
  // it can be set directly, it might need to be unwrapped from the _error property
  return error && error._error ? error._error : error
}

const createField = ({ deepEqual, getIn, setIn }) => {

  class Field extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('Field must be inside a component decorated with reduxForm()')
      }
      this.ConnectedField = createConnectedField(context._reduxForm, {
        deepEqual,
        getIn
      }, props.name)
      this.normalize = this.normalize.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      const nextSyncError = getSyncError(nextContext, nextProps.name)
      return shallowCompare(this, nextProps, nextState) || this.syncError !== nextSyncError
    }

    componentWillMount() {
      this.context._reduxForm.register(this.name, 'Field')
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // name changed, regenerate connected field
        this.ConnectedField =
          createConnectedField(this.context._reduxForm, { deepEqual, getIn }, nextProps.name)
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.name)
    }

    getRenderedComponent() {
      invariant(this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
        'you must specify a withRef prop to Field')
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    get syncError() {
      return getSyncError(this.context, this.props.name)
    }
    
    get name() {
      return this.props.name
    }

    get dirty() {
      return !this.pristine
    }

    get pristine() {
      return this.refs.connected.getWrappedInstance().isPristine()
    }

    get value() {
      return this.refs.connected.getWrappedInstance().getValue()
    }

    normalize(value) {
      const { normalize } = this.props
      if (!normalize) {
        return value
      }
      const previousValues = this.context._reduxForm.getValues()
      const previousValue = this.value
      const nextValues = setIn(previousValues, this.props.name, value)
      return normalize(
        value,
        previousValue,
        nextValues,
        previousValues
      )
    }

    render() {
      return createElement(this.ConnectedField, {
        ...this.props,
        normalize: this.normalize,
        syncError: this.syncError,
        ref: 'connected'
      })
    }
  }

  Field.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any,
    normalize: PropTypes.func,
    props: PropTypes.object
  }
  Field.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return Field
}

export default createField
