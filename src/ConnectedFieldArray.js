import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import bindActionData from './bindActionData'
import plain from './structure/plain'

const createConnectedFieldArray = ({
  asyncValidate,
  blur,
  change,
  focus,
  getFormState,
  initialValues
  }, { deepEqual, getIn }, name) => {

  class ConnectedFieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('ConnectedFieldArray must be inside a component decorated with reduxForm()')
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
      return React.createElement(component,
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

  ConnectedFieldArray.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any
  }

  ConnectedFieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  const actions = bindActionData({ push, pop, shift, unshift }, { field: name })
  const connector = connect(
    (state, ownProps) => ({
      initial: getIn(getFormState(state), `initial.${name}`),
      value: getIn(getFormState(state), `values.${name}`),
      asyncError: getIn(getFormState(state), `asyncErrors.${name}`),
      submitError: getIn(getFormState(state), `submitErrors.${name}`)
    }),
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedFieldArray)
}

export default createConnectedFieldArray
