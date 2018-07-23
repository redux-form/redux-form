// @flow
import React, { Component } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import type { ReactContext } from './types'
import { MUST_BE_INSIDE_REDUX_FORM } from './util/errorMessage'

export type Props = {
  onSubmit: Function
}

class Form extends Component<Props> {
  context: ReactContext

  constructor(props: Props, context: ReactContext) {
    super(props, context)
    if (!context._reduxForm) {
      throw new Error(MUST_BE_INSIDE_REDUX_FORM('Form'))
    }
  }

  componentWillMount() {
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

polyfill(Form)
export default Form
