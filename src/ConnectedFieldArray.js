// @flow
import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import createFieldArrayProps from './createFieldArrayProps'
import { mapValues } from 'lodash'
import plain from './structure/plain'
import type { ElementRef } from 'react'
import type { Structure } from './types'
import type { Props, DefaultProps } from './ConnectedFieldArray.types'
import validateComponentProp from './util/validateComponentProp'

const propsToNotUpdateFor = ['_reduxForm', 'value']

const createConnectedFieldArray = (structure: Structure<*, *>) => {
  const { deepEqual, getIn, size, equals, orderChanged } = structure
  const getSyncError = (syncErrors: Object, name: string) => {
    // For an array, the error can _ONLY_ be under _error.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return plain.getIn(syncErrors, `${name}._error`)
  }

  const getSyncWarning = (syncWarnings: Object, name: string) => {
    // For an array, the warning can _ONLY_ be under _warning.
    // This is why this getSyncError is not the same as the
    // one in Field.
    return getIn(syncWarnings, `${name}._warning`)
  }

  class ConnectedFieldArray extends Component<Props> {
    static defaultProps: DefaultProps
    ref: ElementRef<*> = React.createRef()

    shouldComponentUpdate(nextProps: Props) {
      // Update if the elements of the value array was updated.
      const thisValue: any = this.props.value
      const nextValue: any = nextProps.value

      if (thisValue && nextValue) {
        const nextValueItemsSame = equals(nextValue, thisValue) //.every(val => ~thisValue.indexOf(val))
        const nextValueItemsOrderChanged = orderChanged(thisValue, nextValue)
        const thisValueLength = thisValue.length || thisValue.size
        const nextValueLength = nextValue.length || nextValue.size

        if (
          thisValueLength !== nextValueLength ||
          (nextValueItemsSame && nextValueItemsOrderChanged) ||
          (nextProps.rerenderOnEveryChange &&
            thisValue.some((val, index) => !deepEqual(val, nextValue[index])))
        ) {
          return true
        }
      }

      const nextPropsKeys = Object.keys(nextProps)
      const thisPropsKeys = Object.keys(this.props)
      // if we have children, we MUST update in React 16
      // https://twitter.com/erikras/status/915866544558788608
      return !!(
        this.props.children ||
        nextProps.children ||
        nextPropsKeys.length !== thisPropsKeys.length ||
        nextPropsKeys.some(prop => {
          // useful to debug rerenders
          // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
          //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
          // }
          return (
            !~propsToNotUpdateFor.indexOf(prop) &&
            !deepEqual(this.props[prop], nextProps[prop])
          )
        })
      )
    }

    get dirty(): boolean {
      return this.props.dirty
    }

    get pristine(): boolean {
      return this.props.pristine
    }

    get value(): any {
      return this.props.value
    }

    getRenderedComponent() {
      return this.ref.current
    }

    getValue = (index: number): any =>
      this.props.value && getIn(this.props.value, String(index))

    render() {
      const {
        component,
        forwardRef,
        name,
        _reduxForm, // eslint-disable-line no-unused-vars
        validate, // eslint-disable-line no-unused-vars
        warn, // eslint-disable-line no-unused-vars
        rerenderOnEveryChange, // eslint-disable-line no-unused-vars
        ...rest
      } = this.props
      const props = createFieldArrayProps(
        structure,
        name,
        _reduxForm.form,
        _reduxForm.sectionPrefix,
        this.getValue,
        rest
      )
      if (forwardRef) {
        props.ref = this.ref
      }
      return createElement(component, props)
    }
  }

  ConnectedFieldArray.propTypes = {
    component: validateComponentProp,
    props: PropTypes.object,
    rerenderOnEveryChange: PropTypes.bool
  }

  ConnectedFieldArray.defaultProps = {
    rerenderOnEveryChange: false
  }

  const connector = connect(
    (state, ownProps) => {
      const {
        name,
        _reduxForm: { initialValues, getFormState }
      } = ownProps
      const formState = getFormState(state)
      const initial =
        getIn(formState, `initial.${name}`) ||
        (initialValues && getIn(initialValues, name))
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
      return mapValues(
        {
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
        },
        actionCreator =>
          bindActionCreators(actionCreator.bind(null, name), dispatch)
      )
    },
    undefined,
    { forwardRef: true }
  )
  return connector(ConnectedFieldArray)
}

export default createConnectedFieldArray
