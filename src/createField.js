import { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import createConnectedField from './ConnectedField'
import shallowCompare from './util/shallowCompare'
import prefixName from './util/prefixName'

const createField = ({ deepEqual, getIn, setIn, toJS }) => {
  const ConnectedField = createConnectedField({
    deepEqual,
    getIn,
    toJS
  })

  class Field extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error(
          'Field must be inside a component decorated with reduxForm()'
        )
      }

      this.normalize = this.normalize.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }

    componentWillMount() {
      this.context._reduxForm.register(
        this.name,
        'Field',
        () => this.props.validate,
        () => this.props.warn
      )
    }

    componentWillReceiveProps(nextProps) {
      if (
        this.props.name !== nextProps.name ||
        this.props.validate !== nextProps.validate ||
        this.props.warn !== nextProps.warn
      ) {
        // unregister old name
        this.context._reduxForm.unregister(this.name)
        // register new name
        this.context._reduxForm.register(
          prefixName(this.context, nextProps.name),
          'Field',
          () => nextProps.validate,
          () => nextProps.warn
        )
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.name)
    }

    getRenderedComponent() {
      invariant(
        this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
          'you must specify a withRef prop to Field'
      )
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    get name() {
      return prefixName(this.context, this.props.name)
    }

    get dirty() {
      return !this.pristine
    }

    get pristine() {
      return this.refs.connected.getWrappedInstance().isPristine()
    }

    get value() {
      return (
        this.refs.connected &&
        this.refs.connected.getWrappedInstance().getValue()
      )
    }

    normalize(name, value) {
      const { normalize } = this.props
      if (!normalize) {
        return value
      }
      const previousValues = this.context._reduxForm.getValues()
      const previousValue = this.value
      const nextValues = setIn(previousValues, name, value)
      return normalize(value, previousValue, nextValues, previousValues)
    }

    render() {
      return createElement(ConnectedField, {
        ...this.props,
        name: this.name,
        normalize: this.normalize,
        _reduxForm: this.context._reduxForm,
        ref: 'connected'
      })
    }
  }

  Field.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
      .isRequired,
    format: PropTypes.func,
    normalize: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    parse: PropTypes.func,
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
  Field.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return Field
}

export default createField
