// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormSyncErrorsInterface } from './getFormSyncErrors.types.js.flow'

const createGetFormSyncErrors = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormSyncErrorsInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return getIn(nonNullGetFormState(state), `${form}.syncErrors`)
}

export default createGetFormSyncErrors
