// @flow
import createIsValid from './isValid'
import type { Structure, GetFormState, State } from '../types'

const createIsInvalid = (structure: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState
) => {
  const isValid = createIsValid(structure)(form, getFormState)
  return (state: State) => !isValid(state)
}

export default createIsInvalid
