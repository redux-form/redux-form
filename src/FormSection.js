// @flow
import React, { createElement, Component } from 'react'
import PropTypes from 'prop-types'
import prefixName from './util/prefixName'
import type { ReactContext } from './types'

export type Props = {
  name: string,
  component: Function | string,
  children: any
}

export type DefaultProps = {
  component: Function | string
}

class FormSection extends Component<Props> {
  static defaultProps: DefaultProps
  context: ReactContext

  constructor(props: Props, context: ReactContext) {
    super(props, context)
    if (!context._reduxForm) {
      throw new Error(
        'FormSection must be inside a component decorated with reduxForm()'
      )
    }
  }

  getChildContext() {
    const { context, props: { name } } = this
    return {
      _reduxForm: {
        ...context._reduxForm,
        sectionPrefix: prefixName(context, name)
      }
    }
  }

  render() {
    const {
      children,
      name, // eslint-disable-line no-unused-vars
      component,
      ...rest
    } = this.props

    if (React.isValidElement(children)) {
      return children
    }

    return createElement(component, {
      ...rest,
      children
    })
  }
}

FormSection.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
}

FormSection.defaultProps = {
  component: 'div'
}

FormSection.childContextTypes = {
  _reduxForm: PropTypes.object.isRequired
}

FormSection.contextTypes = {
  _reduxForm: PropTypes.object
}

export default FormSection
