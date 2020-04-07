// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormValuesInterface } from './getFormValues.types'

export default function createGetFormValues({ getIn }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): GetFormValuesInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return getIn(nonNullGetFormState(state), `${form}.values`)
    }
  }
}
