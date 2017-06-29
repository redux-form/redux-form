// @flow
import type { Structure, GetFormState, State } from '../types'

const createGetFormInitialValues = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => getIn(getFormState(state), `${form}.initial`)

export default createGetFormInitialValues
