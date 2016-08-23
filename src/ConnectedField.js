import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
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

  const getSyncError = syncErrors => {
    const error = plain.getIn(syncErrors, name)
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return error && error._error ? error._error : error
  }

  class ConnectedField extends Component {
    shouldComponentUpdate(nextProps) {
      return !deepEqual(this.props, nextProps)
    }

    isPristine() {
      return this.props.pristine
    }

    getValue() {
      return this.props.value
    }

    getRenderedComponent() {
      return this.refs.renderedComponent
    }

    render() {
      const { component, withRef, ...rest } = this.props
      const { custom, ...props } = createFieldProps(getIn,
        name,
        {
          ...rest,
          blur,
          change,
          focus
        },
        asyncValidate
      )
      if (withRef) {
        props.ref = 'renderedComponent'
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
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any,
    props: PropTypes.object
  }

  const connector = connect(
    (state, ownProps) => {
      const formState = getFormState(state)
      const initialState = getIn(formState, `initial.${name}`)
      const initial = initialState === undefined ? propInitialValue : initialState
      const value = getIn(formState, `values.${name}`)
      const submitting = getIn(formState, 'submitting')
      const syncError = getSyncError(getIn(formState, 'syncErrors'))
      const pristine = value === initial
      return {
        asyncError: getIn(formState, `asyncErrors.${name}`),
        asyncValidating: getIn(formState, 'asyncValidating') === name,
        dirty: !pristine,
        pristine,
        state: getIn(formState, `fields.${name}`),
        submitError: getIn(formState, `submitErrors.${name}`),
        submitting,
        syncError,
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
