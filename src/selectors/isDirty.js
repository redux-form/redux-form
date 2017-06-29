// @flow
import createIsPristine from './isPristine'
import type { Structure, GetFormState, State } from '../types'

const createIsDirty = (structure: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState
) => {
  const isPristine = createIsPristine(structure)(form, getFormState)
  return (state: State) => !isPristine(state)
}

export default createIsDirty
