// @flow
import createHasError from '../hasError'
import type { GetFormState, Structure } from '../types'
import type { IsValidInterface } from './isValid.types'

export default function createIsValid(structure: Structure<any, any>) {
  const { getIn, keys } = structure
  const hasError = createHasError(structure)
  return (
    form: string,
    getFormState: ?GetFormState,
    ignoreSubmitErrors: ?boolean = false
  ): IsValidInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      const formState = nonNullGetFormState(state)
      const syncError = getIn(formState, `${form}.syncError`)
      if (syncError) {
        return false
      }
      if (!ignoreSubmitErrors) {
        const error = getIn(formState, `${form}.error`)
        if (error) {
          return false
        }
      }
      const syncErrors = getIn(formState, `${form}.syncErrors`)
      const asyncErrors = getIn(formState, `${form}.asyncErrors`)
      const submitErrors = ignoreSubmitErrors ? undefined : getIn(formState, `${form}.submitErrors`)
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
          hasError(getIn(registeredFields, `['${name}']`), syncErrors, asyncErrors, submitErrors)
        )
    }
  }
}
