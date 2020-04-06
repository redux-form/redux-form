// @flow
import type { Structure, GetFormState } from '../types'
import type { IsSubmittingInterface } from './isSubmitting.types'

export default function createIsSubmitting({ getIn }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): IsSubmittingInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return !!getIn(nonNullGetFormState(state), `${form}.submitting`)
    }
  }
}
