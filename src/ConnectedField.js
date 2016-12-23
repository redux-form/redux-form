import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import plain from './structure/plain'
import onChangeValue from './events/onChangeValue'
import { dataKey } from './util/eventConsts'

const propsToNotUpdateFor = [
  '_reduxForm'
]

const createConnectedField = ({ deepEqual, getIn }) => {

  const getSyncError = (syncErrors, name) => {
    const error = plain.getIn(syncErrors, name)
    // Because the error for this field might not be at a level in the error structure where
    // it can be set directly, it might need to be unwrapped from the _error property
    return error && error._error ? error._error : error
  }

  const getSyncWarning = (syncWarnings, name) => {
    const warning = plain.getIn(syncWarnings, name)
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
      return nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(prop => {
        return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(this.props[ prop ], nextProps[ prop ])
      })
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
      const { name, dispatch, parse, normalize, _reduxForm } = this.props
      const value = onChangeValue(event, { name, parse, normalize })

      dispatch(_reduxForm.change(name, value))
    }

    handleFocus() {
      const { name, dispatch, _reduxForm } = this.props
      dispatch(_reduxForm.focus(name))
    }

    handleBlur(event) {
      const { name, dispatch, parse, normalize, _reduxForm } = this.props
      const value = onChangeValue(event, { name, parse, normalize })

      // dispatch blur action
      dispatch(_reduxForm.blur(name, value))

      // call post-blur callback
      if (_reduxForm.asyncValidate) {
        _reduxForm.asyncValidate(name, value)
      }
    }

    handleDragStart(event) {
      const { value } = this.props
      event.dataTransfer.setData(dataKey, value == null ? '' : value)
    }

    handleDrop(event) {
      const { name, dispatch, _reduxForm } = this.props
      dispatch(_reduxForm.change(name, event.dataTransfer.getData(dataKey)))
      event.preventDefault()
    }

    render() {
      const {
        component,
        withRef,
        name,
        // remove props that are part of redux internals:
        _reduxForm, // eslint-disable-line no-unused-vars
        normalize,  // eslint-disable-line no-unused-vars
        ...rest
      } = this.props
      const { custom, ...props } = createFieldProps(getIn,
        name,
        {
          ...rest,
          onBlur: this.handleBlur,
          onChange: this.handleChange,
          onDrop: this.handleDrop,
          onDragStart: this.handleDragStart,
          onFocus: this.handleFocus
        }
      )
      if (withRef) {
        custom.ref = 'renderedComponent'
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
    props: PropTypes.object
  }

  const connector = connect(
    (state, ownProps) => {
      const { name, _reduxForm: { initialValues, getFormState } } = ownProps
      const formState = getFormState(state)
      const initialState = getIn(formState, `initial.${name}`)
      const initial = initialState !== undefined ? initialState : (initialValues && getIn(initialValues, name))
      const value = getIn(formState, `values.${name}`)
      const submitting = getIn(formState, 'submitting')
      const syncError = getSyncError(getIn(formState, 'syncErrors'), name)
      const syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name)
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
        syncWarning,
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
