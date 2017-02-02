import deepEqual from 'deep-equal'
import React, { Component, PropTypes } from 'react'

class Form extends Component {
  constructor(props, context) {
    super(props, context)
    if (!context._reduxForm) {
      throw new Error('Form must be inside a component decorated with reduxForm()')
    }
  }

  componentWillMount() {
    this.context._reduxForm.registerInnerOnSubmit(this.props.onSubmit)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.onChange) {
      const currentValues = this.context._reduxForm.getValues()
      const currentValuesDiffer = !deepEqual(currentValues, this.previousValues)
      if (currentValuesDiffer) nextProps.onChange(currentValues)
      this.previousValues = currentValues
    }
  }

  render() {
    return <form {...this.props}/>
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
}
Form.contextTypes = {
  _reduxForm: PropTypes.object
}

export default Form
