// @flow
import type { Structure, GetFormState } from '../types'

const createGetFormSubmitErrors = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => getIn(getFormState(state), `${form}.submitErrors`)

export default createGetFormSubmitErrors
