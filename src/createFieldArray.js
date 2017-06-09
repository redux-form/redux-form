import {Component, createElement} from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import createConnectedFieldArray from './ConnectedFieldArray'
import prefixName from './util/prefixName'

const toArray = value => (Array.isArray(value) ? value : [value])

const wrapError = (fn, key) =>
  fn &&
  ((...args) => {
    const validators = toArray(fn)
    for (let i = 0; i < validators.length; i++) {
      const result = validators[i](...args)
      if (result) {
        return {[key]: result}
      }
    }
  })

const createFieldArray = ({deepEqual, getIn, size}) => {
  const ConnectedFieldArray = createConnectedFieldArray({
    deepEqual,
    getIn,
    size
  })

  class FieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error(
          'FieldArray must be inside a component decorated with reduxForm()'
        )
      }
    }

    componentWillMount() {
      const formState = this.context._reduxForm

      console.log('FORMSTATE', formState)

      this.context._reduxForm.queueForRegister(
        this.name,
        'FieldArray',
        () => wrapError(this.props.validate, '_error'),
        () => wrapError(this.props.warn, '_warning')
      )
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // unregister old name
        this.context._reduxForm.unregister(this.name)
        // register new name
        this.context._reduxForm.register(
          prefixName(this.context, nextProps.name),
          'FieldArray'
        )
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.name)
    }

    get name() {
      return prefixName(this.context, this.props.name)
    }

    get dirty() {
      return this.connectedRef.getWrappedInstance().dirty
    }

    get pristine() {
      return this.connectedRef.getWrappedInstance().pristine
    }

    get value() {
      return this.connectedRef.getWrappedInstance().value
    }

    getRenderedComponent() {
      invariant(
        this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
          'you must specify a withRef prop to FieldArray'
      )
      return this.connectedRef.getWrappedInstance().getRenderedComponent()
    }

    render() {
      return createElement(ConnectedFieldArray, {
        ...this.props,
        name: this.name,
        syncError: this.syncError,
        syncWarning: this.syncWarning,
        _reduxForm: this.context._reduxForm,
        ref: x => this.connectedRef = x
      })
    }
  }

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
    props: PropTypes.object,
    validate: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    warn: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    withRef: PropTypes.bool
  }
  FieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return FieldArray
}

export default createFieldArray
