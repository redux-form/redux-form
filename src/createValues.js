// @flow
import { connect } from 'react-redux'
import type { GetFormState, Structure } from './types'

export type Config = {
  form: string,
  getFormState?: GetFormState,
  prop?: string
}

const createValues = ({ getIn }: Structure<*, *>) => (config: Config) => {
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
