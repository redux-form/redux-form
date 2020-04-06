// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormAsyncErrorsInterface } from './getFormAsyncErrors.types'

export default function createGetFormAsyncErrors({ getIn }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): GetFormAsyncErrorsInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return getIn(nonNullGetFormState(state), `${form}.asyncErrors`)
    }
  }
}
