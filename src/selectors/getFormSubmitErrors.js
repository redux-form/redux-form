// @flow
import type { Structure, GetFormState, State } from '../types'

const createGetFormSubmitErrors = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => getIn(getFormState(state), `${form}.submitErrors`)

export default createGetFormSubmitErrors
