// @flow
import type { Structure, GetFormState, State } from '../types'

const createGetFormNames = ({ getIn, keys }: Structure<*, *>) => (
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: State) => keys(getFormState(state))

export default createGetFormNames
