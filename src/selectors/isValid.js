import createHasErrors from '../hasErrors'
import createHasError from '../hasError'
import plain from '../structure/plain'

const plainHasErrors = createHasErrors(plain)

const createIsValid = structure => {
  const { getIn } = structure
  const hasErrors = createHasErrors(structure)
  const hasError = createHasError(structure)
  return (form, getFormState = state => getIn(state, 'form')) =>
    state => {
      const formState = getFormState(state)
      const error = getIn(formState, `${form}.error`)
      if (error) {
        return false
      }
      const syncErrors = getIn(formState, `${form}.syncErrors`)
      if(plainHasErrors(syncErrors)) {
        return false
      }
      const asyncErrors = getIn(formState, `${form}.asyncErrors`)
      if(hasErrors(asyncErrors)) {
        return false
      }
      const submitErrors = getIn(formState, `${form}.submitErrors`)
      if(hasErrors(submitErrors)) {
        return false
      }
      const registeredFields = getIn(formState, `${form}.registeredFields`) || []
      const hasFieldWithError = registeredFields &&
        registeredFields.some(field => hasError(field, syncErrors, asyncErrors, submitErrors))
      return !hasFieldWithError
    }
}

export default createIsValid
