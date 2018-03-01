// @flow
import createHasError from '../hasError'
import type { Structure, GetFormState } from '../types'
import type { IsValidInterface } from './isValid.types'

const createIsValid = (structure: Structure<*, *>) => {
  const { getIn, keys } = structure
  const hasError = createHasError(structure)
  return (
    form: string,
    getFormState: ?GetFormState,
    ignoreOutdatedSubmitErrors: ?boolean = false
  ): IsValidInterface => (state: any) => {
    const nonNullGetFormState: GetFormState =
      getFormState || (state => getIn(state, 'form'))
    const formState = nonNullGetFormState(state)
    const submitErrorsToBeRespected = !ignoreOutdatedSubmitErrors
      ? true
      : !!getIn(formState, `${form}.submitErrorsUpToDate`)

    const syncFormWideError = getIn(formState, `${form}.syncFormWideError`)
    const asyncFormWideError = getIn(formState, `${form}.asyncFormWideError`)
    const submitFormWideError = getIn(formState, `${form}.submitFormWideError`)

    if (
      syncFormWideError ||
      asyncFormWideError ||
      (submitFormWideError && submitErrorsToBeRespected)
    ) {
      return false
    }

    const syncErrors = getIn(formState, `${form}.syncErrors`)
    const asyncErrors = getIn(formState, `${form}.asyncErrors`)
    const submitErrors = !submitErrorsToBeRespected
      ? undefined
      : getIn(formState, `${form}.submitErrors`)
    if (!syncErrors && !asyncErrors && !submitErrors) {
      return true
    }

    const registeredFields = getIn(formState, `${form}.registeredFields`)
    if (!registeredFields) {
      return true
    }

    return !keys(registeredFields)
      .filter(name => getIn(registeredFields, `['${name}'].count`) > 0)
      .some(name =>
        hasError(
          getIn(registeredFields, `['${name}']`),
          syncErrors,
          asyncErrors,
          submitErrors
        )
      )
  }
}

export default createIsValid
