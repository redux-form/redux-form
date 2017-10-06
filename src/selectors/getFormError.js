// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormErrorInterface } from './getFormError.types'

const createGetFormError = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormErrorInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return getIn(nonNullGetFormState(state), `${form}.error`)
}

export default createGetFormError
