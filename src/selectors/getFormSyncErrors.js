// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormSyncErrorsInterface } from './getFormSyncErrors.types'

const createGetFormSyncErrors = ({ getIn, empty }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormSyncErrorsInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return getIn(nonNullGetFormState(state), `${form}.syncErrors`) || empty
}

export default createGetFormSyncErrors
