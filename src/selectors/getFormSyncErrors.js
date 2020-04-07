// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormSyncErrorsInterface } from './getFormSyncErrors.types'

export default function createGetFormSyncErrors({ getIn, empty }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): GetFormSyncErrorsInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return getIn(nonNullGetFormState(state), `${form}.syncErrors`) || empty
    }
  }
}
