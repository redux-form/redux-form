// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import plain from './structure/plain'
import type { Structure } from './types.js.flow'
import type { Props } from './ConnectedFields.types'

const propsToNotUpdateFor = ['_reduxForm']

const createConnectedQueryField = (structure: Structure<*, *>) => {
  const { deepEqual, getIn, size } = structure

  const getSyncError = (syncErrors: Object, name: string) => {
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return (
      plain.getIn(syncErrors, `${name}._error`) || plain.getIn(syncErrors, name)
    )
  }

  const getSyncWarning = (syncWarnings: Object, name: string) => {
    const warning = getIn(syncWarnings, name)
    // Because the warning for this field might not be at a level in the warning structure where
    // it can be set directly, it might need to be unwrapped from the _warning property
    return warning && warning._warning ? warning._warning : warning
  }

  class ConnectedQueryField extends React.Component<Props> {
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
            if (~(nextProps.immutableProps || []).indexOf(prop)) {
              return this.props[prop] !== nextProps[prop]
            }
            return (
              !~propsToNotUpdateFor.indexOf(prop) &&
              !deepEqual(this.props[prop], nextProps[prop])
            )
          }))
      )
    }

    render() {
      const { renderProp, ...rest } = this.props

      return renderProp(rest)
    }
  }

  ConnectedQueryField.propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.node
    ]).isRequired,
    props: PropTypes.object
  }

  const connector = connect((state, ownProps) => {
    const {
      name,
      _reduxForm: { initialValues, getFormState }
    } = ownProps
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
      asyncError: getIn(formState, `asyncErrors.${name}`),
      asyncValidating: getIn(formState, 'asyncValidating') === name,
      dirty: !pristine,
      pristine,
      state: getIn(formState, `fields.${name}`),
      submitError: getIn(formState, `submitErrors.${name}`),
      submitFailed: getIn(formState, 'submitFailed'),
      submitting,
      syncError,
      syncWarning,
      initial,
      value
    }
  })
  return connector(ConnectedQueryField)
}

export default createConnectedQueryField
