import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import prefixName from './util/prefixName'

const createValues = ({getIn}) => (...args) => {
  let valuesMap

  if (typeof args[0] === 'string') {
    valuesMap = args.map(k => ({prop: k, path: k}))
  } else {
    const config = args[0]
    valuesMap = Object.keys(config).map(k => ({
      prop: k,
      path: config[k]
    }))
  }
  if (!valuesMap.length) {
    throw new Error(
      'formValues(): You must specify values to get as formValues(name1, name2, ...) or formValues({propName1: propPath1, ...})'
    )
  }

  // create a class that reads current form name and creates a selector
  // return
  return Component => {
    class FormValues extends React.Component {
      constructor(props, context) {
        super(props, context)
        if (!context._reduxForm) {
          throw new Error(
            'formValues() must be used inside a React tree decorated with reduxForm()'
          )
        }
        const {getValues} = context._reduxForm
        const formValuesSelector = _ => {
          // Yes, we're only using connect() for listening to updates
          const props = {}
          const values = getValues()
          valuesMap.forEach(
            ({prop, path}) =>
              (props[prop] = getIn(values, prefixName(context, path)))
          )
          return props
        }
        this.Component = connect(
          formValuesSelector,
          () => ({}) // ignore dispatch
        )(Component)
      }
      render() {
        return <this.Component {...this.props} />
      }
    }
    FormValues.contextTypes = {
      _reduxForm: PropTypes.object
    }
    return FormValues
  }
}

export default createValues
