// @flow
import type { Structure, GetFormState, State } from '../types'

const createGetFormValues = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => getIn(getFormState(state), `${form}.values`)

export default createGetFormValues
