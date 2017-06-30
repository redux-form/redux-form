// @flow
import type { Structure, GetFormState } from '../types'

const createGetFormNames = ({ getIn, keys }: Structure<*, *>) => (
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => keys(getFormState(state))

export default createGetFormNames
