// @flow
import type { Structure, GetFormState } from '../types'
import type { HasSubmitFailedInterface } from './hasSubmitFailed.types'

export default function createHasSubmitFailed({ getIn }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): HasSubmitFailedInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return !!getIn(nonNullGetFormState(state), `${form}.submitFailed`)
    }
  }
}
