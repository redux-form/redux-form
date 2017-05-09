import createIsValid from './isValid'

const createIsInvalid = structure => (form, getFormState) => {
  const isValid = createIsValid(structure)(form, getFormState)
  return state => !isValid(state)
}

export default createIsInvalid
