// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { memoize } from 'lodash'
import createFieldProps from './createFieldProps'
import plain from './structure/plain'
import onChangeValue from './events/onChangeValue'
import type { ElementRef } from 'react'
import type { Structure } from './types.js.flow'
import type { Props } from './ConnectedFields.types'
import validateComponentProp from './util/validateComponentProp'

const propsToNotUpdateFor = ['_reduxForm']

export default function createConnectedFields(structure: Structure<any, any>) {
  const { deepEqual, getIn } = structure

  const getSyncError = (syncErrors: Object, name: string) => {
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return plain.getIn(syncErrors, `${name}._error`) || plain.getIn(syncErrors, name)
  }

  const getSyncWarning = (syncWarnings: Object, name: string) => {
    const warning = getIn(syncWarnings, name)
    // Because the warning for this field might not be at a level in the warning structure where
    // it can be set directly, it might need to be unwrapped from the _warning property
    return warning && warning._warning ? warning._warning : warning
  }

  class ConnectedFields extends React.Component<Props> {
    ref: ElementRef<any> = React.createRef()

    shouldComponentUpdate(nextProps: Props) {
      const nextPropsKeys = Object.keys(nextProps)
      const thisPropsKeys = Object.keys(this.props)
      // if we have children, we MUST update in React 16
      // https://twitter.com/erikras/status/915866544558788608
      return !!(
        this.props.children ||
        nextProps.children ||
        nextPropsKeys.length !== thisPropsKeys.length ||
        nextPropsKeys.some(prop => {
          return (
            !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(this.props[prop], nextProps[prop])
          )
        })
      )
    }

    isDirty(): boolean {
      const { _fields } = this.props
      return Object.keys(_fields).some(name => _fields[name].dirty)
    }

    getValues(): Object {
      const { _fields } = this.props
      return Object.keys(_fields).reduce(
        (accumulator, name) => plain.setIn(accumulator, name, _fields[name].value),
        {}
      )
    }

    getRenderedComponent() {
      return this.ref.current
    }

    handleChange = memoize((name: string) => (event: any): void => {
      const { dispatch, parse, _reduxForm } = this.props
      const value = onChangeValue(event, { name, parse })

      dispatch(_reduxForm.change(name, value))

      // call post-change callback
      if (_reduxForm.asyncValidate) {
        _reduxForm.asyncValidate(name, value, 'change')
      }
    })

    handleFocus = memoize((name: string) => () => {
      const { dispatch, _reduxForm } = this.props
      dispatch(_reduxForm.focus(name))
    })

    handleBlur = memoize((name: string) => (event: any): void => {
      const { dispatch, parse, _reduxForm } = this.props
      const value = onChangeValue(event, { name, parse })

      // dispatch blur action
      dispatch(_reduxForm.blur(name, value))

      // call post-blur callback
      if (_reduxForm.asyncValidate) {
        _reduxForm.asyncValidate(name, value, 'blur')
      }
    })

    render() {
      const { component, forwardRef, _fields, _reduxForm, ...rest } = this.props
      const { sectionPrefix, form } = _reduxForm
      const { custom, ...props } = Object.keys(_fields).reduce((accumulator, name) => {
        const connectedProps = _fields[name]
        const { custom, ...fieldProps } = createFieldProps(structure, name, {
          ...connectedProps,
          ...rest,
          form,
          onBlur: this.handleBlur(name),
          onChange: this.handleChange(name),
          onFocus: this.handleFocus(name)
        })
        accumulator.custom = custom
        const fieldName = sectionPrefix ? name.replace(`${sectionPrefix}.`, '') : name
        return plain.setIn(accumulator, fieldName, fieldProps)
      }, {})
      if (forwardRef) {
        props.ref = this.ref
      }

      return React.createElement(component, { ...props, ...custom })
    }
  }

  ConnectedFields.propTypes = {
    component: validateComponentProp,
    _fields: PropTypes.object.isRequired,
    props: PropTypes.object
  }

  const connector = connect(
    (state, ownProps) => {
      const {
        names,
        _reduxForm: { initialValues, getFormState }
      } = ownProps
      const formState = getFormState(state)
      return {
        _fields: names.reduce((accumulator, name) => {
          const initialState = getIn(formState, `initial.${name}`)
          const initial =
            initialState !== undefined ? initialState : initialValues && getIn(initialValues, name)
          const value = getIn(formState, `values.${name}`)
          const syncError = getSyncError(getIn(formState, 'syncErrors'), name)
          const syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name)
          const submitting = getIn(formState, 'submitting')
          const pristine = value === initial
          accumulator[name] = {
            asyncError: getIn(formState, `asyncErrors.${name}`),
            asyncValidating: getIn(formState, 'asyncValidating') === name,
            dirty: !pristine,
            initial,
            pristine,
            state: getIn(formState, `fields.${name}`),
            submitError: getIn(formState, `submitErrors.${name}`),
            submitFailed: getIn(formState, 'submitFailed'),
            submitting,
            syncError,
            syncWarning,
            value,
            _value: ownProps.value // save value passed in (for radios)
          }
          return accumulator
        }, {})
      }
    },
    undefined,
    undefined,
    { forwardRef: true }
  )
  return connector(ConnectedFields)
}
