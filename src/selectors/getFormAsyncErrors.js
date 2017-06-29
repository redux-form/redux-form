// @flow
import type { Structure, GetFormState, State } from '../types'

const createGetFormAsyncErrors = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => getIn(getFormState(state), `${form}.asyncErrors`)

export default createGetFormAsyncErrors
