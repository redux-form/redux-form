// @flow
import type { Structure, GetFormState, State } from '../types'

const createHasSubmitFailed = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => !!getIn(getFormState(state), `${form}.submitFailed`)

export default createHasSubmitFailed
