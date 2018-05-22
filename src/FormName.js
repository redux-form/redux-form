// @flow

import * as React from 'react'
import PropTypes from 'prop-types'
import type {ReactContext} from './types'

export type Props = {
  +children: (props: {form: string}) => React.Node,
}

const FormName = ({children}: Props, {_reduxForm}: ReactContext): React.Node => children({form: _reduxForm && _reduxForm.form})
FormName.contextTypes = {
  _reduxForm: PropTypes.shape({
    form: PropTypes.string.isRequired,
  }).isRequired,
}

export default FormName
