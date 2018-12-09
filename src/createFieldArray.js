// @flow
import React, { Component, createElement } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import createConnectedFieldArray from './ConnectedFieldArray'
import prefixName from './util/prefixName'
import { withReduxForm } from './ReduxFormContext'
import type {
  ConnectedComponent,
  Structure,
  ReactContext
} from './types.js.flow'
import type { InstanceApi as ConnectedFieldArrayInstanceApi } from './ConnectedFieldArray.types'
import type { Props as PropsWithoutContext } from './FieldArrayProps.types'
import validateComponentProp from './util/validateComponentProp'

type Props = { _reduxForm?: ReactContext } & PropsWithoutContext

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

  class FieldArray extends React.Component<Props> {
    name: string
    ref: ?ConnectedComponent<ConnectedFieldArrayInstanceApi>

    constructor(props: Props) {
      super(props)
      if (!props._reduxForm) {
        throw new Error(
          'FieldArray must be inside a component decorated with reduxForm()'
        )
      }
    }

    componentDidMount() {
      this.props._reduxForm.register(
        this.name,
        'FieldArray',
        () => wrapError(this.props.validate, '_error'),
        () => wrapError(this.props.warn, '_warning')
      )
    }

    componentWillReceiveProps(nextProps: Props) {
      const oldName = prefixName(this.props, this.props.name)
      const newName = prefixName(nextProps, nextProps.name)

      if (oldName !== newName) {
        // unregister old name
        this.props._reduxForm.unregister(oldName)
        // register new name
        this.props._reduxForm.register(newName, 'FieldArray')
      }
    }

    componentWillUnmount() {
      this.props._reduxForm.unregister(this.name)
    }

    saveRef = (ref: ?React.Component<*, *>) => {
      this.ref = ((ref: any): ?ConnectedComponent<ConnectedFieldArrayInstanceApi>)
    }

    get name(): string {
      return prefixName(this.props, this.props.name)
    }

    get dirty(): boolean {
      return !this.ref || this.ref.dirty
    }

    get pristine(): boolean {
      return !!(this.ref && this.ref.pristine)
    }

    get value(): ?(any[]) {
      return this.ref ? this.ref.value : undefined
    }

    getRenderedComponent() {
      invariant(
        this.props.forwardRef,
        'If you want to access getRenderedComponent(), ' +
          'you must specify a forwardRef prop to FieldArray'
      )
      return this.ref && this.ref.getRenderedComponent()
    }

    render() {
      return createElement(ConnectedFieldArray, {
        ...this.props,
        name: this.name,
        ref: this.saveRef
      })
    }
  }

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: validateComponentProp,
    props: PropTypes.object,
    validate: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    warn: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    forwardRef: PropTypes.bool,
    _reduxForm: PropTypes.object
  }

  polyfill(FieldArray)
  return withReduxForm(FieldArray)
}

export default createFieldArray
