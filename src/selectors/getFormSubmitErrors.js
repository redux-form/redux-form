// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormSubmitErrorsInterface } from './getFormSubmitErrors.types'

const createGetFormSubmitErrors = ({ getIn, empty }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormSubmitErrorsInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return getIn(nonNullGetFormState(state), `${form}.submitErrors`) || empty
}

export default createGetFormSubmitErrors
