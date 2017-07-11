// @flow
import { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import createConnectedFieldArray from './ConnectedFieldArray'
import prefixName from './util/prefixName'
import type {
  ConnectedComponent,
  Structure,
  ReactContext
} from './types.js.flow'
import type { InstanceApi as ConnectedFieldArrayInstanceApi } from './ConnectedFieldArray.types.js.flow'
import type { Props } from './FieldArray.types.js.flow'

const toArray = (value: any): Array<*> =>
  Array.isArray(value) ? value : [value]

const wrapError = (fn: ?Function, key: string): ?Function =>
  fn &&
  ((...args) => {
    const validators = toArray(fn)
    for (let i = 0; i < validators.length; i++) {
      const result = validators[i](...args)
      if (result) {
        return { [key]: result }
      }
    }
  })

const createFieldArray = (structure: Structure<*, *>) => {
  const ConnectedFieldArray = createConnectedFieldArray(structure)

  class FieldArray extends Component {
    props: Props
    context: ReactContext

    name: string
    ref: ConnectedComponent<ConnectedFieldArrayInstanceApi>

    constructor(props: Props, context: ReactContext) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error(
          'FieldArray must be inside a component decorated with reduxForm()'
        )
      }
    }

    componentWillMount() {
      this.context._reduxForm.register(
        this.name,
        'FieldArray',
        () => wrapError(this.props.validate, '_error'),
        () => wrapError(this.props.warn, '_warning')
      )
    }

    componentWillReceiveProps(nextProps: Props) {
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

    saveRef = (ref: ConnectedComponent<ConnectedFieldArrayInstanceApi>) =>
      (this.ref = ref)

    get name(): string {
      return prefixName(this.context, this.props.name)
    }

    get dirty(): boolean {
      return this.ref.getWrappedInstance().dirty
    }

    get pristine(): boolean {
      return this.ref.getWrappedInstance().pristine
    }

    get value(): ?(any[]) {
      return this.ref.getWrappedInstance().value
    }

    getRenderedComponent() {
      invariant(
        this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
          'you must specify a withRef prop to FieldArray'
      )
      return this.ref.getWrappedInstance().getRenderedComponent()
    }

    render() {
      return createElement(ConnectedFieldArray, {
        ...this.props,
        name: this.name,
        _reduxForm: this.context._reduxForm,
        ref: this.saveRef
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
