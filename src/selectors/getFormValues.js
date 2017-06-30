// @flow
import type { Structure, GetFormState } from '../types'

const createGetFormValues = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => getIn(getFormState(state), `${form}.values`)

export default createGetFormValues
