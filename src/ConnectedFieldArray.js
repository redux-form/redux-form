import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import createFieldArrayProps from './createFieldArrayProps'
import partial from './util/partial'
import mapValues from './util/mapValues'
import plain from './structure/plain'

const createConnectedFieldArray = ({
  arrayInsert,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift,
  asyncValidate,
  blur,
  change,
  focus,
  getFormState,
  initialValues
}, { deepEqual, getIn, size }, name) => {

  class ConnectedFieldArray extends Component {
    shouldComponentUpdate(nextProps) {
      return size(this.props.value) !== size(nextProps.value)
    }

    get syncError() {
      const { _reduxForm: { getSyncErrors } } = this.context
      return plain.getIn(getSyncErrors(), `${name}._error`)
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
      const { component, withRef, ...rest } = this.props
      const props = createFieldArrayProps(
        deepEqual,
        getIn,
        size,
        name,
        rest,
        this.syncError,
        initialValues && getIn(initialValues, name)
      )
      if (withRef) {
        props.ref = 'renderedComponent'
      }
      return React.createElement(component, props)
    }
  }

  ConnectedFieldArray.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any
  }

  ConnectedFieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  const actions = mapValues({
    arrayInsert,
    arrayPop,
    arrayPush,
    arrayRemove,
    arrayShift,
    arraySplice,
    arraySwap,
    arrayUnshift
  }, actionCreator => partial(actionCreator, name))
  const connector = connect(
    state => ({
      initial: getIn(getFormState(state), `initial.${name}`),
      value: getIn(getFormState(state), `values.${name}`),
      asyncError: getIn(getFormState(state), `asyncErrors.${name}._error`),
      submitError: getIn(getFormState(state), `submitErrors.${name}._error`)
    }),
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedFieldArray)
}

export default createConnectedFieldArray
