import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import createFieldArrayProps from './createFieldArrayProps'
import { mapValues } from 'lodash'
import shallowCompare from 'react-addons-shallow-compare'

const createConnectedFieldArray = ({
  arrayInsert,
  arrayMove,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
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

  const propInitialValue = initialValues && getIn(initialValues, name)

  class ConnectedFieldArray extends Component {
    shouldComponentUpdate(nextProps) {
      return shallowCompare(this, nextProps)
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
      const { component, withRef, ...rest } = this.props
      const props = createFieldArrayProps(
        getIn,
        size,
        name,
        rest
      )
      if (withRef) {
        props.ref = 'renderedComponent'
      }
      return createElement(component, props)
    }
  }

  ConnectedFieldArray.propTypes = {
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any,
    props: PropTypes.object
  }

  ConnectedFieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  const actions = mapValues({
    arrayInsert,
    arrayMove,
    arrayPop,
    arrayPush,
    arrayRemove,
    arrayRemoveAll,
    arrayShift,
    arraySplice,
    arraySwap,
    arrayUnshift
  }, actionCreator => actionCreator.bind(null, name))
  const connector = connect(
    state => {
      const initial = getIn(getFormState(state), `initial.${name}`) || propInitialValue
      const value = getIn(getFormState(state), `values.${name}`)
      const pristine = deepEqual(value, initial)
      return {
        asyncError: getIn(getFormState(state), `asyncErrors.${name}._error`),
        dirty: !pristine,
        pristine,
        submitError: getIn(getFormState(state), `submitErrors.${name}._error`),
        value
      }
    },
    actions,
    undefined,
    { withRef: true }
  )
  return connector(ConnectedFieldArray)
}

export default createConnectedFieldArray
