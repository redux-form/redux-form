// @flow
import { Component, createElement } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import createConnectedFields from './ConnectedFields'
import shallowCompare from './util/shallowCompare'
import plain from './structure/plain'
import prefixName from './util/prefixName'
import type { Structure, ReactContext } from './types'
import type { Props } from './FieldsProps.types'
import validateComponentProp from './util/validateComponentProp'
import { validateNameProp } from './util/validateNameProp'

const createFields = (structure: Structure<*, *>) => {
  const ConnectedFields = createConnectedFields(structure)

  class Fields extends Component<Props> {
    constructor(props: Props, context: ReactContext) {
      super((props: Props), (context: ReactContext))
      if (!context._reduxForm) {
        throw new Error(
          'Fields must be inside a component decorated with reduxForm()'
        )
      }
      const error = validateNameProp(props.names, 'Fields')
      if (error) {
        throw error
      }
    }

    shouldComponentUpdate(nextProps: Props) {
      return shallowCompare(this, nextProps)
    }

    componentDidMount() {
      const { context } = this
      const {
        _reduxForm: { register }
      } = context
      this.names.forEach(name => register(name, 'Field'))
    }

    componentWillReceiveProps(nextProps: Props) {
      if (!plain.deepEqual(this.props.names, nextProps.names)) {
        const { context } = this
        const { register, unregister } = context._reduxForm
        // unregister old name
        this.props.names.forEach(name => unregister(prefixName(context, name)))
        // register new name
        nextProps.names.forEach(name =>
          register(prefixName(context, name), 'Field')
        )
      }
    }

    componentWillUnmount() {
      const { context } = this
      const { unregister } = context._reduxForm
      this.props.names.forEach(name => unregister(prefixName(context, name)))
    }

    getRenderedComponent() {
      invariant(
        this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
          'you must specify a withRef prop to Fields'
      )
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    get names(): string[] {
      const { context } = this
      return this.props.names.map(name => prefixName(context, name))
    }

    get dirty(): boolean {
      return this.refs.connected.getWrappedInstance().isDirty()
    }

    get pristine(): boolean {
      return !this.dirty
    }

    get values(): Object {
      return (
        this.refs.connected &&
        this.refs.connected.getWrappedInstance().getValues()
      )
    }

    render() {
      const { context } = this
      return createElement(ConnectedFields, {
        ...this.props,
        names: this.props.names.map(name => prefixName(context, name)),
        _reduxForm: this.context._reduxForm,
        ref: 'connected'
      })
    }
  }

  Fields.propTypes = {
    names: (props, propName) => validateNameProp(props[propName], 'Fields'),
    component: validateComponentProp,
    format: PropTypes.func,
    parse: PropTypes.func,
    props: PropTypes.object,
    withRef: PropTypes.bool
  }
  Fields.contextTypes = {
    _reduxForm: PropTypes.object
  }

  polyfill(Fields)
  return Fields
}

export default createFields
