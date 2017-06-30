// @flow
import type { Structure, GetFormState } from '../types'

const createGetFormInitialValues = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => getIn(getFormState(state), `${form}.initial`)

export default createGetFormInitialValues
