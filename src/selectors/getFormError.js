// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormAsyncErrorsInterface } from './getFormAsyncErrors.types.js.flow'

const createGetFormError = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormAsyncErrorsInterface => (state: any) => {
  const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))

  return getIn(nonNullGetFormState(state), `${form}._error`)
}

export default createGetFormError
