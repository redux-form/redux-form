// @flow
import React, { createElement, Component } from 'react'
import PropTypes from 'prop-types'
import prefixName from './util/prefixName'
import { withReduxForm, ReduxFormContext } from './ReduxFormContext'
import type { ReactContext } from './types'
import validateComponentProp from './util/validateComponentProp'

export type Props = {
  name: string,
  component: Function | string,
  children: any
}

type PropsWithContext = ReactContext & Props

export type DefaultProps = {
  component: Function | string
}

class FormSection extends Component<PropsWithContext> {
  static defaultProps: DefaultProps
  context: ReactContext

  constructor(props: PropsWithContext) {
    super(props)
    if (!props._reduxForm) {
      throw new Error(
        'FormSection must be inside a component decorated with reduxForm()'
      )
    }
  }

  render() {
    const {
      _reduxForm,
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
