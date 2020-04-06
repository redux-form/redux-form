// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormInitialValuesInterface } from './getFormInitialValues.types'

export default function createGetFormInitialValues({ getIn }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): GetFormInitialValuesInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return getIn(nonNullGetFormState(state), `${form}.initial`)
    }
  }
}
