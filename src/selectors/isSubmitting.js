// @flow
import type { Structure, GetFormState, State } from '../types'

const createIsSubmitting = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => !!getIn(getFormState(state), `${form}.submitting`)

export default createIsSubmitting
