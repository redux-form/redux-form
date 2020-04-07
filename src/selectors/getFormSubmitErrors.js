// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormSubmitErrorsInterface } from './getFormSubmitErrors.types'

export default function createGetFormSubmitErrors({ getIn, empty }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): GetFormSubmitErrorsInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return getIn(nonNullGetFormState(state), `${form}.submitErrors`) || empty
    }
  }
}
