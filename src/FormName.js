// @flow

import PropTypes from 'prop-types'
import type { Node } from 'react'
import type { ReactContext } from './types'

export type Props = {
  +children: (props: { form: string, sectionPrefix: ?string }) => Node
}

const FormName = ({ children }: Props, { _reduxForm }: ReactContext): Node =>
  children({
    form: _reduxForm && _reduxForm.form,
    sectionPrefix: _reduxForm && _reduxForm.sectionPrefix
  })
FormName.contextTypes = {
  _reduxForm: PropTypes.shape({
    form: PropTypes.string.isRequired,
    sectionPrefix: PropTypes.string
  }).isRequired
}

export default FormName
