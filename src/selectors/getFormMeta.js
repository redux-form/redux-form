// @flow
import type { Structure, GetFormState, State } from '../types'

const createGetFormMeta = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => getIn(getFormState(state), `${form}.fields`)

export default createGetFormMeta
