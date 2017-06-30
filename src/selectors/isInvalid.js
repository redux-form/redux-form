// @flow
import createIsValid from './isValid'
import type { Structure, GetFormState } from '../types'

const createIsInvalid = (structure: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState
) => {
  const isValid = createIsValid(structure)(form, getFormState)
  return (state: any) => !isValid(state)
}

export default createIsInvalid
