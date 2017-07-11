// @flow
import type { Structure, GetFormState } from '../types'
import type { HasSubmitSucceededInterface } from './hasSubmitSucceeded.types.js.flow'

const createHasSubmitSucceeded = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): HasSubmitSucceededInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return !!getIn(nonNullGetFormState(state), `${form}.submitSucceeded`)
}

export default createHasSubmitSucceeded
