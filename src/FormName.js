// @flow
import * as React from 'react'
import { withReduxForm } from './ReduxFormContext'
import type { ReactContext } from './types'

export type Props = {
  +children: (props: { form: string, sectionPrefix: ?string }) => React.Node
}

type PropsWithContext = ReactContext & Props

const FormName = ({ children, _reduxForm }: PropsWithContext): React.Node =>
  children({
    form: _reduxForm && _reduxForm.form,
    sectionPrefix: _reduxForm && _reduxForm.sectionPrefix
  })

export default withReduxForm(FormName)
