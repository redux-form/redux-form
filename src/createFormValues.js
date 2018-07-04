// @flow
import { isEmpty, isEqual, mapValues } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import prefixName from './util/prefixName'
import type { ComponentType } from 'react'
import type { Structure, ReactContext } from './types'
import type { FormValuesInterface } from './formValues.types'

const createValues = ({ getIn }: Structure<*, *>): FormValuesInterface => (
  firstArg: string | Object | Function,
  ...rest: string[]
) => {
  // create a class that reads current form name and creates a selector
  // return
  return (Component: ComponentType<*>): ComponentType<*> => {
    class FormValues extends React.Component<Object> {
      context: ReactContext
      Component: ComponentType<*>
      _valuesMap: Object

      constructor(props: Object, context: ReactContext) {
        super(props, context)
        if (!context._reduxForm) {
          throw new Error(
            'formValues() must be used inside a React tree decorated with reduxForm()'
          )
        }
        this.updateComponent(props)
      }
      componentWillReceiveProps(props) {
        if (typeof firstArg === 'function') {
          this.updateComponent(props)
        }
      }
      render() {
        const { Component } = this
        return (
          <Component
            // so that the connected component updates props when sectionPrefix has changed
            sectionPrefix={this.context._reduxForm.sectionPrefix}
            {...this.props}
          />
        )
      }
      updateComponent(props) {
        let valuesMap: Object
        const resolvedFirstArg: string | Object =
          typeof firstArg === 'function' ? firstArg(props) : firstArg
        if (typeof resolvedFirstArg === 'string') {
          valuesMap = rest.reduce(
            (result, k) => {
              result[k] = k
              return result
            },
            { [resolvedFirstArg]: resolvedFirstArg }
          )
        } else {
          valuesMap = resolvedFirstArg
        }
        if (isEmpty(valuesMap)) {
          // maybe that empty valuesMap is ok if firstArg is a function?
          // if this is the case, we probably should set this.Component = Component
          throw new Error(
            'formValues(): You must specify values to get as formValues(name1, name2, ...) or formValues({propName1: propPath1, ...}) or formValues((props) => name) or formValues((props) => ({propName1: propPath1, ...}))'
          )
        }
        if (isEqual(valuesMap, this._valuesMap)) {
          // no change in valuesMap
          return
        }
        this._valuesMap = valuesMap
        this.setComponent()
      }
      setComponent() {
        const formValuesSelector = (_, { sectionPrefix }) => {
          // Yes, we're only using connect() for listening to updates.
          // The second argument needs to be there so that connect calls
          // the selector when props change
          const { getValues } = this.context._reduxForm
          const values = getValues()
          return mapValues(this._valuesMap, (path: string) =>
            getIn(values, prefixName(this.context, path))
          )
        }
        this.Component = connect(
          formValuesSelector,
          () => ({}) // ignore dispatch
        )(({ sectionPrefix, ...otherProps }) => <Component {...otherProps} />)
      }
    }
    FormValues.contextTypes = {
      _reduxForm: PropTypes.object
    }
    return FormValues
  }
}

export default createValues
