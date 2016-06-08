import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldProps from './createFieldProps'
import { mapValues } from 'lodash'

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
      const props = createFieldProps(getIn,
        name,
        rest,
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
    defaultValue: PropTypes.any,
    props: PropTypes.object
  }

  ConnectedField.contextTypes = {
    _reduxForm: PropTypes.object
  }

  const actions = mapValues({ blur, change, focus }, actionCreator => actionCreator.bind(null, name))
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
