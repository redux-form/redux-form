// @flow
import { PureComponent, createElement } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import type { Structure, ReactContext } from './types.js.flow'
import invariant from 'invariant'
import type { Props } from './FieldProps.types'
import createConnectedField from './ConnectedField'
import prefixName from './util/prefixName'
import { removeFieldHandlers } from './util/removeHandlers'
import { compose } from 'lodash/fp'

const createQueryField = (structure: Structure<*, *>) => {
  const ConnectedField = createConnectedField(structure)

  class QueryField extends PureComponent<Props> {
    context: ReactContext

    constructor(props: Props, context: ReactContext) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error(
          'QueryField must be inside a component decorated with reduxForm()'
        )
      }
    }

    render() {
      const { children, render, name, ...rest } = this.props
      const prefixedName = prefixName(this.context, name)

      const renderProp = render || children
      invariant(renderProp, 'render or child prop is required')
      const component = compose(
        renderProp,
        removeFieldHandlers
      )

      return createElement(ConnectedField, {
        ...rest,
        _reduxForm: this.context._reduxForm,
        name: prefixedName,
        component
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
