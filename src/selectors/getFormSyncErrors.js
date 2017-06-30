// @flow
import type { Structure, GetFormState } from '../types'

const createGetFormSyncErrors = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => getIn(getFormState(state), `${form}.syncErrors`)

export default createGetFormSyncErrors
