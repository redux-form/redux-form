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
      const asyncErrors = getIn(formState, `${form}.asyncErrors`)
      const submitErrors = getIn(formState, `${form}.submitErrors`)
      const syncErrors = getIn(formState, `${form}.syncErrors`)
      const hasSyncErrors = plainHasErrors(syncErrors)
      const hasAsyncErrors = hasErrors(asyncErrors)
      const hasSubmitErrors = hasErrors(submitErrors)
      const registeredFields = getIn(formState, `${form}.registeredFields`) || []
      const hasFieldWithError = registeredFields &&
        registeredFields.some(field => hasError(field, syncErrors, asyncErrors, submitErrors))
      return !hasSyncErrors && !hasAsyncErrors && !hasSubmitErrors && !hasFieldWithError
    }
}

export default createIsValid
