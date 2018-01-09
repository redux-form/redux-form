// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormErrorInterface } from './getFormError.types'

const createGetFormError = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormErrorInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  const formState = nonNullGetFormState(state)

  return (
    getIn(formState, `${form}.syncFormWideError`) ||
    getIn(formState, `${form}.asyncFormWideError`) ||
    getIn(formState, `${form}.submitFormWideError`)
  )
}

export default createGetFormError
