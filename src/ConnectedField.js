import {Component, createElement} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import createFieldProps from './createFieldProps'
import onChangeValue from './events/onChangeValue'
import {dataKey} from './util/eventConsts'
import plain from './structure/plain'

const propsToNotUpdateFor = ['_reduxForm']

const createConnectedField = ({deepEqual, getIn, toJS}) => {
  const getSyncError = (syncErrors, name) => {
    const error = plain.getIn(syncErrors, name)
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

  class ConnectedField extends Component {
    constructor(props) {
      super(props)

      this.handleChange = this.handleChange.bind(this)
      this.handleFocus = this.handleFocus.bind(this)
      this.handleBlur = this.handleBlur.bind(this)
      this.handleDragStart = this.handleDragStart.bind(this)
      this.handleDrop = this.handleDrop.bind(this)
    }

    shouldComponentUpdate(nextProps) {
      const nextPropsKeys = Object.keys(nextProps)
      const thisPropsKeys = Object.keys(this.props)
      return (
        nextPropsKeys.length !== thisPropsKeys.length ||
        nextPropsKeys.some(prop => {
          return (
            !~propsToNotUpdateFor.indexOf(prop) &&
            !deepEqual(this.props[prop], nextProps[prop])
          )
        })
      )
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

    handleChange(event) {
      const {
        name,
        dispatch,
        parse,
        normalize,
        onChange,
        _reduxForm,
        value: previousValue
      } = this.props
      const newValue = onChangeValue(event, {name, parse, normalize})

      let defaultPrevented = false
      if (onChange) {
        onChange(
          {
            ...event,
            preventDefault: () => {
              defaultPrevented = true
              return event.preventDefault()
            }
          },
          newValue,
          previousValue
        )
      }
      if (!defaultPrevented) {
        // dispatch change action
        dispatch(_reduxForm.change(name, newValue))
      }
    }

    handleFocus(event) {
      const {name, dispatch, onFocus, _reduxForm} = this.props

      let defaultPrevented = false
      if (onFocus) {
        onFocus({
          ...event,
          preventDefault: () => {
            defaultPrevented = true
            return event.preventDefault()
          }
        })
      }

      if (!defaultPrevented) {
        dispatch(_reduxForm.focus(name))
      }
    }

    handleBlur(event) {
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
      let newValue = onChangeValue(event, {name, parse, normalize})

      // for checkbox and radio, if the value property of checkbox or radio equals
      // the value passed by blur event, then fire blur action with previousValue.
      if (newValue === _value && _value !== undefined) {
        newValue = previousValue
      }

      let defaultPrevented = false
      if (onBlur) {
        onBlur(
          {
            ...event,
            preventDefault: () => {
              defaultPrevented = true
              return event.preventDefault()
            }
          },
          newValue,
          previousValue
        )
      }

      if (!defaultPrevented) {
        // dispatch blur action
        dispatch(_reduxForm.blur(name, newValue))

        // call post-blur callback
        if (_reduxForm.asyncValidate) {
          _reduxForm.asyncValidate(name, newValue)
        }
      }
    }

    handleDragStart(event) {
      const {onDragStart, value} = this.props
      event.dataTransfer.setData(dataKey, value == null ? '' : value)

      if (onDragStart) {
        onDragStart(event)
      }
    }

    handleDrop(event) {
      const {
        name,
        dispatch,
        onDrop,
        _reduxForm,
        value: previousValue
      } = this.props
      const newValue = event.dataTransfer.getData(dataKey)

      let defaultPrevented = false
      if (onDrop) {
        onDrop(
          {
            ...event,
            preventDefault: () => {
              defaultPrevented = true
              return event.preventDefault()
            }
          },
          newValue,
          previousValue
        )
      }

      if (!defaultPrevented) {
        // dispatch change action
        dispatch(_reduxForm.change(name, newValue))
        event.preventDefault()
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
      const {custom, ...props} = createFieldProps({getIn, toJS}, name, {
        ...rest,
        form: _reduxForm.form,
        onBlur: this.handleBlur,
        onChange: this.handleChange,
        onDrop: this.handleDrop,
        onDragStart: this.handleDragStart,
        onFocus: this.handleFocus
      })
      if (withRef) {
        custom.ref = 'renderedComponent'
      }
      if (typeof component === 'string') {
        const {input, meta} = props // eslint-disable-line no-unused-vars
        // flatten input into other props
        return createElement(component, {...input, ...custom})
      } else {
        return createElement(component, {...props, ...custom})
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
      const {name, _reduxForm: {initialValues, getFormState}} = ownProps
      const formState = getFormState(state)
      const initialState = getIn(formState, `initial.${name}`)
      const initial = initialState !== undefined
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
        value,
        _value: ownProps.value // save value passed in (for checkboxes)
      }
    },
    undefined,
    undefined,
    {withRef: true}
  )
  return connector(ConnectedField)
}

export default createConnectedField
