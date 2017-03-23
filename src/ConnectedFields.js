import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import plain from './structure/plain'
import onChangeValue from './events/onChangeValue'

const propsToNotUpdateFor = [
  '_reduxForm'
]

const createConnectedFields = ({ deepEqual, getIn, toJS, size }) => {

  const getSyncError = (syncErrors, name) => {
    const error = getIn(syncErrors, name)
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return error && error._error ? error._error : error
  }

  const getSyncWarning = (syncWarnings, name) => {
    const warning = getIn(syncWarnings, name)
    // Because the warning for this field might not be at a level in the warning structure where
    // it can be set directly, it might need to be unwrapped from the _warning property
    return warning && warning._warning ? warning._warning : warning
  }

  class ConnectedFields extends Component {
    constructor(props) {
      super(props)

      this.handleChange = this.handleChange.bind(this)
      this.handleFocus = this.handleFocus.bind(this)
      this.handleBlur = this.handleBlur.bind(this)

      this.onChangeFns = props.names.reduce((acc, name) => {
        acc[name] = event => this.handleChange(name, event)
        return acc
      }, {})

      this.onFocusFns = props.names.reduce((acc, name) => {
        acc[name] = () => this.handleFocus(name)
        return acc
      }, {})

      this.onBlurFns = props.names.reduce((acc, name) => {
        acc[name] = event => this.handleBlur(name, event)
        return acc
      }, {})
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.names !== nextProps.names &&
        (size(this.props.names) !== size(nextProps.names) ||
        nextProps.names.some(nextName => !this.props._fields[nextName]))) {

        // names is changed. The cached event handlers need to be updated
        this.onChangeFns = nextProps.names.reduce((acc, name) => {
          acc[name] = event => this.handleChange(name, event)
          return acc
        }, {})

        this.onFocusFns = nextProps.names.reduce((acc, name) => {
          acc[name] = () => this.handleFocus(name)
          return acc
        }, {})

        this.onBlurFns = nextProps.names.reduce((acc, name) => {
          acc[name] = event => this.handleBlur(name, event)
          return acc
        }, {})
      }
    }

    shouldComponentUpdate(nextProps) {
      const nextPropsKeys = Object.keys(nextProps)
      const thisPropsKeys = Object.keys(this.props)
      return nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(prop => {
        return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(this.props[ prop ], nextProps[ prop ])
      })
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

    handleChange(name, event) {
      const { dispatch, parse, normalize, _reduxForm } = this.props
      const value = onChangeValue(event, { name, parse, normalize })

      dispatch(_reduxForm.change(name, value))
    }

    handleFocus(name) {
      const { dispatch, _reduxForm } = this.props
      dispatch(_reduxForm.focus(name))
    }

    handleBlur(name, event) {
      const { dispatch, parse, normalize, _reduxForm } = this.props
      const value = onChangeValue(event, { name, parse, normalize })

      // dispatch blur action
      dispatch(_reduxForm.blur(name, value))

      // call post-blur callback
      if (_reduxForm.asyncValidate) {
        _reduxForm.asyncValidate(name, value)
      }
    }

    render() {
      const { component, withRef, _fields, _reduxForm, ...rest } = this.props
      const { sectionPrefix } = _reduxForm
      const { custom, ...props } = Object.keys(_fields).reduce((accumulator, name) => {
        const connectedProps = _fields[ name ]
        const { custom, ...fieldProps } = createFieldProps({ getIn, toJS },
          name,
          {
            ...connectedProps,
            ...rest,
            onBlur: this.onBlurFns[name],
            onChange: this.onChangeFns[name],
            onFocus: this.onFocusFns[name]
          }
        )
        accumulator.custom = custom
        const fieldName = sectionPrefix ? name.replace(`${sectionPrefix}.`, '') : name
        return plain.setIn(accumulator, fieldName, fieldProps)
      }, {})
      if (withRef) {
        props.ref = 'renderedComponent'
      }

      return createElement(component, { ...props, ...custom })
    }
  }

  ConnectedFields.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    _fields: PropTypes.object.isRequired,
    props: PropTypes.object
  }

  const connector = connect(
    (state, ownProps) => {
      const { names, _reduxForm: { initialValues, getFormState } } = ownProps
      const formState = getFormState(state)
      return {
        _fields: names.reduce((accumulator, name) => {
          const initialState = getIn(formState, `initial.${name}`)
          const initial = initialState !== undefined ? initialState : (initialValues && getIn(initialValues, name))
          const value = getIn(formState, `values.${name}`)
          const syncError = getSyncError(getIn(formState, 'syncErrors'), name)
          const syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name)
          const submitting = getIn(formState, 'submitting')
          const pristine = value === initial
          accumulator[ name ] = {
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
