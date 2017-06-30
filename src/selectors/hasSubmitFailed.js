// @flow
import type { Structure, GetFormState } from '../types'

const createHasSubmitFailed = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => !!getIn(getFormState(state), `${form}.submitFailed`)

export default createHasSubmitFailed
