// @flow
import type { Structure, GetFormState } from '../types'
import type { HasSubmitSucceededInterface } from './hasSubmitSucceeded.types'

export default function createHasSubmitSucceeded({ getIn }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): HasSubmitSucceededInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return !!getIn(nonNullGetFormState(state), `${form}.submitSucceeded`)
    }
  }
}
