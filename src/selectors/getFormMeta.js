// @flow
import type { Structure, GetFormState } from '../types'

const createGetFormMeta = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => getIn(getFormState(state), `${form}.fields`)

export default createGetFormMeta
