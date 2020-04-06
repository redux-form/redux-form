// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormErrorInterface } from './getFormError.types'

export default function createGetFormError({ getIn }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): GetFormErrorInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return getIn(nonNullGetFormState(state), `${form}.error`)
    }
  }
}
