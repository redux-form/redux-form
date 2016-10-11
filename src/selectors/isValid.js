import createHasError from '../hasError'

const createIsValid = structure => {
  const { getIn } = structure
  const hasError = createHasError(structure)
  return (form, getFormState = state => getIn(state, 'form')) =>
    state => {
      const formState = getFormState(state)
      const syncError = getIn(formState, `${form}.syncError`)
      if (syncError) {
        return false
      }
      const syncErrors = getIn(formState, `${form}.syncErrors`)
      const asyncErrors = getIn(formState, `${form}.asyncErrors`)
      const submitErrors = getIn(formState, `${form}.submitErrors`)
      if(!syncErrors && !asyncErrors && !submitErrors) {
        return true
      }

      const registeredFields = getIn(formState, `${form}.registeredFields`) || []
      return !registeredFields.some(field => hasError(field, syncErrors, asyncErrors, submitErrors))
    }
}

export default createIsValid
