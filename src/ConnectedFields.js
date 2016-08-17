import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import plain from './structure/plain'

const createConnectedFields = ({
  asyncValidate,
  blur,
  change,
  focus,
  getFormState,
  initialValues
}, { deepEqual, getIn }, names) => {

  const getSyncError = (syncErrors, name) => {
    const error = plain.getIn(syncErrors, name)
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return error && error._error ? error._error : error
  }

  class ConnectedFields extends Component {
    shouldComponentUpdate(nextProps) {
      return !deepEqual(this.props, nextProps)
    }

    isDirty() {
      const { _fields } = this.props
      return Object.keys(_fields).some(name => _fields[ name ].dirty)
    }

    getValues() {
      const { _fields } = this.props
      return Object.keys(_fields).reduce((accumulator, name) =>
        plain.setIn(accumulator, name, _fields[ name ].value), {})
    }

    getRenderedComponent() {
      return this.refs.renderedComponent
    }

    render() {
      const { component, withRef, _fields, ...rest } = this.props

      const props = Object.keys(_fields).reduce((accumulator, name) => {
        const connectedProps = _fields[ name ]
        const fieldProps = createFieldProps(getIn,
          name,
          {
            ...connectedProps,
            ...rest,
            blur,
            change,
            focus
          },
          asyncValidate
        )
        return plain.setIn(accumulator, name, fieldProps)
      }, {})
      if (withRef) {
        props.ref = 'renderedComponent'
      }

      return createElement(component, props)
    }
  }

  ConnectedFields.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any,
    _fields: PropTypes.object.isRequired,
    props: PropTypes.object
  }

  const connector = connect(
    (state, ownProps) => {
      const formState = getFormState(state)
      return {
        _fields: names.reduce((accumulator, name) => {
          const initialState = getIn(formState, `initial.${name}`)
          const propInitialValue = initialValues && getIn(initialValues, name)
          const initial = initialState === undefined ? propInitialValue : initialState
          const value = getIn(formState, `values.${name}`)
          const syncError = getSyncError(getIn(formState, 'syncErrors'), name)
          const pristine = value === initial
          accumulator[ name ] = {
            asyncError: getIn(formState, `asyncErrors.${name}`),
            asyncValidating: getIn(formState, 'asyncValidating') === name,
            dirty: !pristine,
            pristine,
            state: getIn(formState, `fields.${name}`),
            submitError: getIn(formState, `submitErrors.${name}`),
            syncError,
            value,
            _value: ownProps.value // save value passed in (for checkboxes)
          }
          return accumulator
        }, {})
      }
    },
    undefined,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedFields)
}

export default createConnectedFields
