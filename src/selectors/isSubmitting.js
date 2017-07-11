// @flow
import type { Structure, GetFormState } from '../types'
import type { IsSubmittingInterface } from './isSubmitting.types.js.flow'

const createIsSubmitting = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): IsSubmittingInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return !!getIn(nonNullGetFormState(state), `${form}.submitting`)
}

export default createIsSubmitting
