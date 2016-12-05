import React, { Component, PropTypes } from 'react'
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
    const { children } = this.props

    if (React.isValidElement(children)) {
      return children
    }

    return <div>{children}</div>
  }
}

FormSection.propTypes = {
  name: PropTypes.string.isRequired
}

FormSection.childContextTypes = {
  _reduxForm: PropTypes.object.isRequired
}

FormSection.contextTypes = {
  _reduxForm: PropTypes.object
}

export default FormSection
