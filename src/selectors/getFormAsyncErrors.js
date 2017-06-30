// @flow
import type { Structure, GetFormState } from '../types'

const createGetFormAsyncErrors = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => getIn(getFormState(state), `${form}.asyncErrors`)

export default createGetFormAsyncErrors
