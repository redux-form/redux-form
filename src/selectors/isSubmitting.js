// @flow
import type { Structure, GetFormState } from '../types'

const createIsSubmitting = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => !!getIn(getFormState(state), `${form}.submitting`)

export default createIsSubmitting
