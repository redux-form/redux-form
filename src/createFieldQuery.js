// @flow
import React, { Component, createElement } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
// import plain from './structure/plain'
import type {
  ConnectedComponent,
  Structure,
  ReactContext
} from './types.js.flow'
import shallowCompare from './util/shallowCompare'
import { connect } from 'react-redux'
import type { Props } from './FieldProps.types'
import createConnectedField from './ConnectedQueryField'

const createQueryField = structure => {
  const ConnectedQueryField = createConnectedField(structure)

  class QueryField extends Component<Props> {
    context: ReactContext

    constructor(props: Props, context: ReactContext) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error(
          'QueryField must be inside a component decorated with reduxForm()'
        )
      }
    }

    shouldComponentUpdate(nextProps: Props, nextState?: Object) {
      return shallowCompare(this, nextProps, nextState)
    }

    render() {
      const { children, render, name } = this.props
      const renderProp = children || render
      return createElement(ConnectedQueryField, {
        ...this.props,
        _reduxForm: this.context._reduxForm,
        name,
        renderProp
      })
    }
  }

  QueryField.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.func,
    render: PropTypes.func
  }

  QueryField.contextTypes = {
    _reduxForm: PropTypes.object
  }

  polyfill(QueryField)
  return QueryField
}

export default createQueryField
