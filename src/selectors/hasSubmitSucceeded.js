// @flow
import type { Structure, GetFormState, State } from '../types'

const createHasSubmitSucceeded = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => !!getIn(getFormState(state), `${form}.submitSucceeded`)

export default createHasSubmitSucceeded
