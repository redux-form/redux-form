// @flow
import type { Structure, GetFormState, State } from '../types'

const createGetFormSyncErrors = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => getIn(getFormState(state), `${form}.syncErrors`)

export default createGetFormSyncErrors
