// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormNamesInterface } from './getFormNames.types.js.flow'

const createGetFormNames = ({ getIn, keys }: Structure<*, *>) => (
  getFormState: ?GetFormState
) => (state: any): GetFormNamesInterface => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return keys(nonNullGetFormState(state))
}

export default createGetFormNames
