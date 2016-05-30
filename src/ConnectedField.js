import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import { partial, mapValues } from 'lodash'
import plain from './structure/plain'

const createConnectedField = ({
  asyncValidate,
  blur,
  change,
  focus,
  getFormState,
  initialValues
}, { deepEqual, getIn }, name) => {

  const propInitialValue = initialValues && getIn(initialValues, name)

  class ConnectedField extends Component {
    shouldComponentUpdate(nextProps) {
      return !deepEqual(this.props, nextProps)
    }

    get syncError() {
      const { _reduxForm: { getSyncErrors } } = this.context
      const error = plain.getIn(getSyncErrors(), name)
      // Because the error for this field might not be at a level in the error structure where
      // it can be set directly, it might need to be unwrapped from the _error property
      return error && error._error ? error._error : error
    }

    get dirty() {
      return this.props.dirty
    }

    get pristine() {
      return this.props.pristine
    }

    get value() {
      return this.props.value
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
        defaultValue,
        asyncValidate
      )
      if (withRef) {
        props.ref = 'renderedComponent'
      }
      return createElement(component, props)
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
    (state, ownProps) => {
      const initial = getIn(getFormState(state), `initial.${name}`) || propInitialValue
      const value = getIn(getFormState(state), `values.${name}`)
      const pristine = value === initial
      return {
        asyncError: getIn(getFormState(state), `asyncErrors.${name}`),
        asyncValidating: getIn(getFormState(state), 'asyncValidating') === name,
        dirty: !pristine,
        pristine,
        state: getIn(getFormState(state), `fields.${name}`),
        submitError: getIn(getFormState(state), `submitErrors.${name}`),
        value,
        _value: ownProps.value // save value passed in (for checkboxes)
      }
    },
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedField)
}

export default createConnectedField
