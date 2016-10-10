import React, { Component, PropTypes } from 'react'
import prefixName from './utils/prefixName'

class SubForm extends Component {
  getChildContext() {
    const { context, props: { name } } = this
    return { nestedFormPrefix: prefixName(context, name) }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

SubForm.propTypes = {
  name: PropTypes.string.isRequired
}

SubForm.childContextTypes = {
  _reduxForm: PropTypes.object.isRequired
}

SubForm.contextTypes = {
  _reduxForm: PropTypes.object
}

export default SubForm
