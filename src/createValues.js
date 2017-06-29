// @flow
import { connect } from 'react-redux'
import type { Structure } from './types'

const createValues = ({ getIn }: Structure<*, *>) => (config: Object) => {
  const { form, prop, getFormState } = {
    prop: 'values',
    getFormState: state => getIn(state, 'form'),
    ...config
  }
  return connect(
    state => ({
      [prop]: getIn(getFormState(state), `${form}.values`)
    })
    // ignore dispatch
  )
}

export default createValues
