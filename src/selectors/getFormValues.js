// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormValuesInterface } from './getFormValues.types'

const createGetFormValues = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormValuesInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return getIn(nonNullGetFormState(state), `${form}.values`)
}

export default createGetFormValues
