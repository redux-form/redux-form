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

  class ConnectedFieldArray extends Component {
    shouldComponentUpdate(nextProps) {
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

    render() {
      /*eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_reduxForm$" }]*/
      const { component, withRef, name, _reduxForm, ...rest } = this.props
      const props = createFieldArrayProps(
        getIn,
        name,
        {
          ...rest,
          name
        }
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
      const pristine = deepEqual(value, initial)
      return {
        asyncError: getIn(formState, `asyncErrors.${name}._error`),
        dirty: !pristine,
        pristine,
        state: getIn(formState, `fields.${name}`),
        submitError: getIn(formState, `submitErrors.${name}._error`),
        submitting,
        syncError,
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
