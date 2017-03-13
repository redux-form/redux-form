import { Component, PropTypes, createElement } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import createFieldArrayProps from './createFieldArrayProps'
import { mapValues } from 'lodash'
import plain from './structure/plain'

const propsToNotUpdateFor = [
  '_reduxForm',
  'value'
]

const createConnectedFieldArray = ({ deepEqual, getIn, size }) => {

  const getSyncError = (syncErrors, name) => {
    // For an array, the error can _ONLY_ be under _error.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return plain.getIn(syncErrors, `${name}._error`)
  }

  const getSyncWarning = (syncWarnings, name) => {
    // For an array, the warning can _ONLY_ be under _warning.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return plain.getIn(syncWarnings, `${name}._warning`)
  }

  class ConnectedFieldArray extends Component {
    constructor() {
      super()
      this.getValue = this.getValue.bind(this)
    }

    shouldComponentUpdate(nextProps) {
      // Update if the elements of the value array was updated.
      const thisValue = this.props.value
      const nextValue = nextProps.value

      if (thisValue && nextValue) {
        if (thisValue.length !== nextValue.length || thisValue.every(val => nextValue.some(next => deepEqual(val, next)))) {
          return true
        }
      }

      const nextPropsKeys = Object.keys(nextProps)
      const thisPropsKeys = Object.keys(this.props)
      return nextPropsKeys.length !== thisPropsKeys.length || nextPropsKeys.some(prop => {
        // useful to debug rerenders
        // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
        //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
        // }
        return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(this.props[ prop ], nextProps[ prop ])
      })
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

    getValue(index) {
      return this.props.value && getIn(this.props.value, index)
    }

    render() {
      const {
        component,
        withRef,
        name,
        _reduxForm, // eslint-disable-line no-unused-vars
        validate, // eslint-disable-line no-unused-vars
        warn, // eslint-disable-line no-unused-vars
        ...rest
      } = this.props
      const props = createFieldArrayProps(
        getIn,
        name,
        _reduxForm.sectionPrefix,
        this.getValue,
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
    props: PropTypes.object
  }

  ConnectedFieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  const connector = connect(
    (state, ownProps) => {
      const { name, _reduxForm: { initialValues, getFormState } } = ownProps
      const formState = getFormState(state)
      const initial = getIn(formState, `initial.${name}`) || (initialValues && getIn(initialValues, name))
      const value = getIn(formState, `values.${name}`)
      const submitting = getIn(formState, 'submitting')
      const syncError = getSyncError(getIn(formState, 'syncErrors'), name)
      const syncWarning = getSyncWarning(getIn(formState, 'syncWarnings'), name)
      const pristine = deepEqual(value, initial)
      return {
        asyncError: getIn(formState, `asyncErrors.${name}._error`),
        dirty: !pristine,
        pristine,
        state: getIn(formState, `fields.${name}`),
        submitError: getIn(formState, `submitErrors.${name}._error`),
        submitFailed: getIn(formState, 'submitFailed'),
        submitting,
        syncError,
        syncWarning,
        value,
        length: size(value)
      }
    },
    (dispatch, ownProps) => {
      const { name, _reduxForm } = ownProps
      const {
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
      } = _reduxForm
      return mapValues({
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
      }, actionCreator => bindActionCreators(actionCreator.bind(null, name), dispatch))
    },
    undefined,
    { withRef: true }
  )
  return connector(ConnectedFieldArray)
}

export default createConnectedFieldArray
