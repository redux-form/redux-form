// @flow
import type { Structure, GetFormState } from '../types'
import type { HasSubmitFailedInterface } from './hasSubmitFailed.types.js.flow'

const createHasSubmitFailed = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): HasSubmitFailedInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return !!getIn(nonNullGetFormState(state), `${form}.submitFailed`)
}

export default createHasSubmitFailed
