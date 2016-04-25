import React, { Component, PropTypes } from 'react'
import isClass from 'is-class'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import bindActionData from './bindActionData'
import plain from './structure/plain'

const createConnectedField = ({
  asyncValidate,
  blur,
  change,
  focus,
  getFormState,
  initialValues
  }, { deepEqual, getIn }, name) => {

  class ConnectedField extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('ConnectedField must be inside a component decorated with reduxForm()')
      }
    }

    shouldComponentUpdate(nextProps) {
      return !deepEqual(this.props, nextProps)
    }

    get syncError() {
      const { _reduxForm: { syncErrors } } = this.context
      return plain.getIn(syncErrors, name)
    }

    get valid() {
      const { asyncError, submitError } = this.props

      const error = this.syncError || asyncError || submitError

      return !error
    }

    render() {
      const { component, defaultValue, ...props } = this.props
      const factory = isClass(component) ? React.createFactory(component) : component
      return factory(
        createFieldProps(
          getIn,
          name,
          props,
          this.syncError,
          initialValues && getIn(initialValues, name),
          defaultValue,
          asyncValidate
        )
      )
    }
  }

  ConnectedField.propTypes = {
    component: PropTypes.func.isRequired,
    defaultValue: PropTypes.any
  }

  ConnectedField.contextTypes = {
    _reduxForm: PropTypes.object
  }

  const actions = bindActionData({ blur, change, focus }, { field: name })
  const connector = connect(
    (state, ownProps) => ({
      initial: getIn(getFormState(state), `initial.${name}`),
      value: getIn(getFormState(state), `values.${name}`),
      state: getIn(getFormState(state), `fields.${name}`),
      asyncError: getIn(getFormState(state), `asyncErrors.${name}`),
      submitError: getIn(getFormState(state), `submitErrors.${name}`),
      submitFailed: getIn(getFormState(state), 'submitFailed'),
      _value: ownProps.value // save value passed in (for checkboxes)
    }),
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedField)
}

export default createConnectedField
