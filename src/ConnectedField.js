import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import partial from './util/partial'
import mapValues from './util/mapValues'
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
    shouldComponentUpdate(nextProps) {
      return !deepEqual(this.props, nextProps)
    }

    get syncError() {
      const { _reduxForm: { getSyncErrors } } = this.context
      return plain.getIn(getSyncErrors(), name)
    }

    get valid() {
      const { asyncError, submitError } = this.props

      const error = this.syncError || asyncError || submitError

      return !error
    }

    getRenderedComponent() {
      return this.refs.renderedComponent
    }

    render() {
      const { component, defaultValue, withRef, ...rest } = this.props
      const props = createFieldProps(getIn,
        name,
        rest,
        this.syncError,
        initialValues && getIn(initialValues, name),
        defaultValue,
        asyncValidate
      )
      if (withRef) {
        props.ref = 'renderedComponent'
      }
      return React.createElement(component, props)
    }
  }

  ConnectedField.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any
  }

  ConnectedField.contextTypes = {
    _reduxForm: PropTypes.object
  }

  const actions = mapValues({ blur, change, focus }, actionCreator => partial(actionCreator, name))
  const connector = connect(
    (state, ownProps) => ({
      initial: getIn(getFormState(state), `initial.${name}`),
      value: getIn(getFormState(state), `values.${name}`),
      state: getIn(getFormState(state), `fields.${name}`),
      asyncError: getIn(getFormState(state), `asyncErrors.${name}`),
      submitError: getIn(getFormState(state), `submitErrors.${name}`),
      asyncValidating: getIn(getFormState(state), 'asyncValidating') === name,
      _value: ownProps.value // save value passed in (for checkboxes)
    }),
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedField)
}

export default createConnectedField
