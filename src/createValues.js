// @flow
import { connect } from 'react-redux'
import type { Structure } from './types'
import type { Config } from './values.types'

export default function createValues({ getIn }: Structure<any, any>) {
  return (config: Config) => {
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
}
