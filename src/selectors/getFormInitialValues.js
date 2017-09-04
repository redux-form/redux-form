// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormInitialValuesInterface } from './getFormInitialValues.types'

const createGetFormInitialValues = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): GetFormInitialValuesInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return getIn(nonNullGetFormState(state), `${form}.initial`)
}

export default createGetFormInitialValues
