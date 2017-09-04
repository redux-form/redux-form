// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormSyncWarningsInterface } from './getFormSyncWarnings.types'

const createGetFormSyncWarnings = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormSyncWarningsInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return getIn(nonNullGetFormState(state), `${form}.syncWarnings`)
}

export default createGetFormSyncWarnings
