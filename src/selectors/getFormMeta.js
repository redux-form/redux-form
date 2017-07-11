// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormMetaInterface } from './getFormMeta.types.js.flow'

const createGetFormMeta = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormMetaInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return getIn(nonNullGetFormState(state), `${form}.fields`)
}

export default createGetFormMeta
