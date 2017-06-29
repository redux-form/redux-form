// @flow
import type { Structure, GetFormState, State } from '../types'

const createGetFormSyncWarnings = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => getIn(getFormState(state), `${form}.syncWarnings`)

export default createGetFormSyncWarnings
