// @flow
import { Component, createElement } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import createConnectedFields from './ConnectedFields'
import shallowCompare from './util/shallowCompare'
import plain from './structure/plain'
import prefixName from './util/prefixName'
import { withReduxForm } from './ReduxFormContext'
import type { Structure, ReactContext } from './types'
import type { Props as PropsWithoutContext } from './FieldsProps.types'
import validateComponentProp from './util/validateComponentProp'

type Props = { _reduxForm?: ReactContext } & PropsWithoutContext

const validateNameProp = prop => {
  if (!prop) {
    return new Error('No "names" prop was specified <Fields/>')
  }
  if (!Array.isArray(prop) && !prop._isFieldArray) {
    return new Error(
      'Invalid prop "names" supplied to <Fields/>. Must be either an array of strings or the fields array generated by FieldArray.'
    )
  }
}

const createFields = (structure: Structure<*, *>) => {
  const ConnectedFields = createConnectedFields(structure)

  class Fields extends Component<Props> {
    constructor(props: Props) {
      super((props: Props))
      if (!props._reduxForm) {
        throw new Error(
          'Fields must be inside a component decorated with reduxForm()'
        )
      }
      const error = validateNameProp(props.names)
      if (error) {
        throw error
      }
    }

    shouldComponentUpdate(nextProps: Props) {
      return shallowCompare(this, nextProps)
    }

    componentDidMount() {
      const { props } = this
      const {
        _reduxForm: { register }
      } = props
      this.names.forEach(name => register(name, 'Field'))
    }

    componentWillReceiveProps(nextProps: Props) {
      if (!plain.deepEqual(this.props.names, nextProps.names)) {
        const { props } = this
        const { register, unregister } = props._reduxForm
        // unregister old name
        this.props.names.forEach(name => unregister(prefixName(props, name)))
        // register new name
        nextProps.names.forEach(name =>
          register(prefixName(props, name), 'Field')
        )
      }
    }

    componentWillUnmount() {
      const { props } = this
      const { unregister } = props._reduxForm
      this.props.names.forEach(name => unregister(prefixName(props, name)))
    }

    getRenderedComponent() {
      invariant(
        this.props.forwardRef,
        'If you want to access getRenderedComponent(), ' +
          'you must specify a forwardRef prop to Fields'
      )
      return this.refs.connected.getRenderedComponent()
    }

    get names(): string[] {
      const { props } = this
      return this.props.names.map(name => prefixName(props, name))
    }

    get dirty(): boolean {
      return this.refs.connected.isDirty()
    }

    get pristine(): boolean {
      return !this.dirty
    }

    get values(): Object {
      return this.refs.connected && this.refs.connected.getValues()
    }

    render() {
      const { props } = this
      return createElement(ConnectedFields, {
        ...this.props,
        names: this.props.names.map(name => prefixName(props, name)),
        ref: 'connected'
      })
    }
  }

  Fields.propTypes = {
    names: (props, propName) => validateNameProp(props[propName]),
    component: validateComponentProp,
    format: PropTypes.func,
    parse: PropTypes.func,
    props: PropTypes.object,
    forwardRef: PropTypes.bool,
    _reduxForm: PropTypes.object
  }

  polyfill(Fields)
  return withReduxForm(Fields)
}

export default createFields
