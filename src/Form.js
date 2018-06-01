// @flow
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type { ReactContext } from './types'

export type Props = {
  onSubmit: Function
}

class Form extends Component<Props> {
  context: ReactContext

  constructor(props: Props, context: ReactContext) {
    super(props, context)
    if (!context._reduxForm) {
      throw new Error(
        'Form must be inside a component decorated with reduxForm()'
      )
    }
  }

  UNSAFE_componentWillMount() {
    this.context._reduxForm.registerInnerOnSubmit(this.props.onSubmit)
  }

  render() {
    return <form {...this.props} />
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
}
Form.contextTypes = {
  _reduxForm: PropTypes.object
}

export default Form
