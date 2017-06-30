// @flow
import type { Structure, GetFormState } from '../types'

const createHasSubmitSucceeded = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => !!getIn(getFormState(state), `${form}.submitSucceeded`)

export default createHasSubmitSucceeded
