// @flow
import React, { Component, createElement } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import type {
  ConnectedComponent,
  Structure,
  ReactContext
} from './types.js.flow'
import shallowCompare from './util/shallowCompare'
import { connect } from 'react-redux'
import type { Props } from './FieldProps.types'
import createConnectedField from './ConnectedQueryField'
import prefixName from './util/prefixName'

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
      const { children, render, ...rest } = this.props
      const name = prefixName(this.context, this.props.name)
      const renderProp = children || render
      return createElement(ConnectedQueryField, {
        ...rest,
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
