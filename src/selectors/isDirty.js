import createIsPristine from './isPristine'

const createIsDirty = structure =>
  (form, getFormState) => {
    const isPristine = createIsPristine(structure)(form, getFormState)
    return state => !isPristine(state)
  }

export default createIsDirty
