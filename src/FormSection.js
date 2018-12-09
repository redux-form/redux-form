// @flow
import React, { createElement, Component } from 'react'
import PropTypes from 'prop-types'
import prefixName from './util/prefixName'
import { withReduxForm, ReduxFormContext } from './ReduxFormContext'
import type { ReactContext } from './types'
import validateComponentProp from './util/validateComponentProp'

export type PropsWithoutContext = {
  name: string,
  component: Function | string,
  children: any
}

type Props = { _reduxForm?: ReactContext } & PropsWithoutContext

export type DefaultProps = {
  component: Function | string
}

class FormSection extends Component<Props> {
  static defaultProps: DefaultProps
  context: ReactContext

  constructor(props: Props) {
    super(props)
    if (!props._reduxForm) {
      throw new Error(
        'FormSection must be inside a component decorated with reduxForm()'
      )
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
      return createElement(ReduxFormContext.Provider, {
        value: {
          ...this.props._reduxForm,
          sectionPrefix: prefixName(this.props, name)
        },
        children
      })
    }

    return createElement(ReduxFormContext.Provider, {
      value: {
        ...this.props._reduxForm,
        sectionPrefix: prefixName(this.props, name)
      },
      children: createElement(component, {
        ...rest,
        children
      })
    })
  }
}

FormSection.propTypes = {
  name: PropTypes.string.isRequired,
  component: validateComponentProp
}

FormSection.defaultProps = {
  component: 'div'
}

export default withReduxForm(FormSection)
