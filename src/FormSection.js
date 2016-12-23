import React, { createElement, Component, PropTypes } from 'react'
import prefixName from './util/prefixName'

class FormSection extends Component {
  constructor(props, context) {
    super(props, context)
    if (!context._reduxForm) {
      throw new Error('FormSection must be inside a component decorated with reduxForm()')
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
  component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ])
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
