// @flow
import type { Structure, GetFormState } from '../types'

const createGetFormSyncWarnings = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => getIn(getFormState(state), `${form}.syncWarnings`)

export default createGetFormSyncWarnings
