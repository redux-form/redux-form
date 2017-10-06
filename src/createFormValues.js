// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import prefixName from './util/prefixName'
import type { ComponentType } from 'react'
import type { Structure, ReactContext } from './types'
import type { FormValuesInterface, PropPath } from './formValues.types'

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

      constructor(props: Object, context: ReactContext) {
        super(props, context)
        if (!context._reduxForm) {
          throw new Error(
            'formValues() must be used inside a React tree decorated with reduxForm()'
          )
        }
        let valuesMap: PropPath[]
        const resolvedFirstArg: string | Object =
          typeof firstArg === 'function' ? firstArg(props) : firstArg
        if (typeof resolvedFirstArg === 'string') {
          valuesMap = [
            resolvedFirstArg,
            ...rest
          ].map((k: string): PropPath => ({
            prop: k,
            path: k
          }))
        } else {
          const config: Object = resolvedFirstArg
          valuesMap = Object.keys(config).map(k => ({
            prop: k,
            path: config[k]
          }))
        }
        if (!valuesMap.length) {
          throw new Error(
            'formValues(): You must specify values to get as formValues(name1, name2, ...) or formValues({propName1: propPath1, ...}) or formValues((props) => name) or formValues((props) => ({propName1: propPath1, ...}))'
          )
        }
        const formValuesSelector = (_, { sectionPrefix }) => {
          // Yes, we're only using connect() for listening to updates.
          // The second argument needs to be there so that connect calls
          // the selector when props change
          const { getValues } = this.context._reduxForm
          const props = {}
          const values = getValues()
          valuesMap.forEach(
            ({ prop, path }) =>
              (props[prop] = getIn(values, prefixName(this.context, path)))
          )
          return props
        }
        this.Component = connect(
          formValuesSelector,
          () => ({}) // ignore dispatch
        )(({ sectionPrefix, ...otherProps }) => <Component {...otherProps} />)
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
    }
    FormValues.contextTypes = {
      _reduxForm: PropTypes.object
    }
    return FormValues
  }
}

export default createValues
