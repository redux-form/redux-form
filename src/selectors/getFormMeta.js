// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormMetaInterface } from './getFormMeta.types'

export default function createGetFormMeta({ getIn, empty }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): GetFormMetaInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return getIn(nonNullGetFormState(state), `${form}.fields`) || empty
    }
  }
}
