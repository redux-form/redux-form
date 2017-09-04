// @flow
import createIsValid from './isValid'
import type { Structure, GetFormState } from '../types'
import type { IsInvalidInterface } from './isInvalid.types'

const createIsInvalid = (structure: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): IsInvalidInterface => {
  const isValid = createIsValid(structure)(form, getFormState)
  return (state: any) => !isValid(state)
}

export default createIsInvalid
