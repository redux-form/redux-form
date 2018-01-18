// @flow
import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import onChangeValue from './events/onChangeValue'
import { dataKey } from './util/eventConsts'
import plain from './structure/plain'
import isReactNative from './isReactNative'
import type { Structure } from './types.js.flow'
import type { Props } from './ConnectedField.types'

const propsToNotUpdateFor = ['_reduxForm']

const isObject = entity => entity && typeof entity === 'object'

const isFunction = entity => entity && typeof entity === 'function'

const eventPreventDefault = event => {
  if (isObject(event) && isFunction(event.preventDefault)) {
    event.preventDefault()
  }
}

const eventDataTransferGetData = (event, key) => {
  if (
    isObject(event) &&
    isObject(event.dataTransfer) &&
    isFunction(event.dataTransfer.getData)
  ) {
    return event.dataTransfer.getData(key)
  }
}

const eventDataTransferSetData = (event, key, value) => {
  if (
    isObject(event) &&
    isObject(event.dataTransfer) &&
    isFunction(event.dataTransfer.setData)
  ) {
    event.dataTransfer.setData(key, value)
  }
}

const createConnectedField = (structure: Structure<*, *>) => {
  const { deepEqual, getIn } = structure
  const getSyncError = (syncErrors: Object, name: string) => {
    const error = plain.getIn(syncErrors, name)
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return error && error._error ? error._error : error
  }

  const getSyncWarning = (syncWarnings: Object, name: string) => {
    const warning = getIn(syncWarnings, name)
    // Because the warning for this field might not be at a level in the warning structure where
    // it can be set directly, it might need to be unwrapped from the _warning property
    return warning && warning._warning ? warning._warning : warning
  }

  class ConnectedField extends Component<Props> {
    ref: React.Component<*, *>

    shouldComponentUpdate(nextProps: Props) {
      const nextPropsKeys = Object.keys(nextProps)
      const thisPropsKeys = Object.keys(this.props)
      // if we have children, we MUST update in React 16
      // https://twitter.com/erikras/status/915866544558788608
      return !!(
        this.props.children ||
        nextProps.children ||
        (nextPropsKeys.length !== thisPropsKeys.length ||
          nextPropsKeys.some(prop => {
            return (
              !~propsToNotUpdateFor.indexOf(prop) &&
              !deepEqual(this.props[prop], nextProps[prop])
            )
          }))
      )
    }

    saveRef = (ref: React.Component<*, *>) => (this.ref = ref)

    isPristine = (): boolean => this.props.pristine

    getValue = (): any => this.props.value

    getRenderedComponent(): React.Component<*, *> {
      return this.ref
    }

    handleChange = (event: any) => {
      const {
        name,
        dispatch,
        parse,
        normalize,
        onChange,
        _reduxForm,
        value: previousValue
      } = this.props
      const newValue = onChangeValue(event, { name, parse, normalize })

      let defaultPrevented = false
      if (onChange) {
        // Can't seem to find a way to extend Event in React Native,
        // thus I simply avoid adding preventDefault() in a RN environment
        // to prevent the following error:
        // `One of the sources for assign has an enumerable key on the prototype chain`
        // Reference: https://github.com/facebook/react-native/issues/5507
        if (!isReactNative) {
          onChange(
            {
              ...event,
              preventDefault: () => {
                defaultPrevented = true
                return eventPreventDefault(event)
              }
            },
            newValue,
            previousValue
          )
        } else {
          onChange(event, newValue, previousValue)
        }
      }
      if (!defaultPrevented) {
        // dispatch change action
        dispatch(_reduxForm.change(name, newValue))

        // call post-change callback
        if (_reduxForm.asyncValidate) {
          _reduxForm.asyncValidate(name, newValue, 'change')
        }
      }
    }

    handleFocus = (event: any) => {
      const { name, dispatch, onFocus, _reduxForm } = this.props

      let defaultPrevented = false
      if (onFocus) {
        if (!isReactNative) {
          onFocus({
            ...event,
            preventDefault: () => {
              defaultPrevented = true
              return eventPreventDefault(event)
            }
          })
        } else {
          onFocus(event)
        }
      }

      if (!defaultPrevented) {
        dispatch(_reduxForm.focus(name))
      }
    }

    handleBlur = (event: any) => {
      const {
        name,
        dispatch,
        parse,
        normalize,
        onBlur,
        _reduxForm,
        _value,
        value: previousValue
      } = this.props
      let newValue = onChangeValue(event, { name, parse, normalize })

      // for checkbox and radio, if the value property of checkbox or radio equals
      // the value passed by blur event, then fire blur action with previousValue.
      if (newValue === _value && _value !== undefined) {
        newValue = previousValue
      }

      let defaultPrevented = false
      if (onBlur) {
        if (!isReactNative) {
          onBlur(
            {
              ...event,
              preventDefault: () => {
                defaultPrevented = true
                return eventPreventDefault(event)
              }
            },
            newValue,
            previousValue
          )
        } else {
          onBlur(event, newValue, previousValue)
        }
      }

      if (!defaultPrevented) {
        // dispatch blur action
        dispatch(_reduxForm.blur(name, newValue))

        // call post-blur callback
        if (_reduxForm.asyncValidate) {
          _reduxForm.asyncValidate(name, newValue, 'blur')
        }
      }
    }

    handleDragStart = (event: any) => {
      const { onDragStart, value } = this.props
      eventDataTransferSetData(event, dataKey, value == null ? '' : value)

      if (onDragStart) {
        onDragStart(event)
      }
    }

    handleDrop = (event: any) => {
      const {
        name,
        dispatch,
        onDrop,
        _reduxForm,
        value: previousValue
      } = this.props
      const newValue = eventDataTransferGetData(event, dataKey)

      let defaultPrevented = false
      if (onDrop) {
        onDrop(
          {
            ...event,
            preventDefault: () => {
              defaultPrevented = true
              return eventPreventDefault(event)
            }
          },
          newValue,
          previousValue
        )
      }

      if (!defaultPrevented) {
        // dispatch change action
        dispatch(_reduxForm.change(name, newValue))
        eventPreventDefault(event)
      }
    }

    render() {
      const {
        component,
        withRef,
        name,
        // remove props that are part of redux internals:
        _reduxForm, // eslint-disable-line no-unused-vars
        normalize, // eslint-disable-line no-unused-vars
        onBlur, // eslint-disable-line no-unused-vars
        onChange, // eslint-disable-line no-unused-vars
        onFocus, // eslint-disable-line no-unused-vars
        onDragStart, // eslint-disable-line no-unused-vars
        onDrop, // eslint-disable-line no-unused-vars
        ...rest
      } = this.props
      const { custom, ...props } = createFieldProps(structure, name, {
        ...rest,
        form: _reduxForm.form,
        onBlur: this.handleBlur,
        onChange: this.handleChange,
        onDrop: this.handleDrop,
        onDragStart: this.handleDragStart,
        onFocus: this.handleFocus
      })
      if (withRef) {
        custom.ref = this.saveRef
      }
      if (typeof component === 'string') {
        const { input, meta } = props // eslint-disable-line no-unused-vars
        // flatten input into other props
        return createElement(component, { ...input, ...custom })
      } else {
        return createElement(component, { ...props, ...custom })
      }
    }
  }

  ConnectedField.propTypes = {
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
      .isRequired,
    props: PropTypes.object
  }

  const connector = connect(
    (state, ownProps) => {
      const { name, _reduxForm: { initialValues, getFormState } } = ownProps
      const formState = getFormState(state)
      const initialState = getIn(formState, `initial.${name}`)
      const initial =
        initialState !== undefined
          ? initialState
          : initialValues && getIn(initialValues, name)
      const value = getIn(formState, `values.${name}`)
      const submitting = getIn(formState, 'submitting')
      const syncError = getSyncError(getIn(formState, 'syncErrors'), name)
      const syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name)
      const pristine = deepEqual(value, initial)
      return {
        asyncError: getIn(formState, `asyncErrors['${name}']`),
        asyncValidating: getIn(formState, 'asyncValidating') === name,
        dirty: !pristine,
        pristine,
        state: getIn(formState, `fields.${name}`),
        submitError: getIn(formState, `submitErrors['${name}']`),
        submitFailed: getIn(formState, 'submitFailed'),
        submitting,
        syncError,
        syncWarning,
        initial,
        value,
        _value: ownProps.value // save value passed in (for checkboxes)
      }
    },
    undefined,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedField)
}

export default createConnectedField
