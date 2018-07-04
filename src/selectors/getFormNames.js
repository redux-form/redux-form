// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormNamesInterface } from './getFormNames.types'

function createGetFormNames<L>({ getIn, keys }: Structure<*, L>) {
  return (getFormState: ?GetFormState): GetFormNamesInterface<L> => (
    state: any
  ) => {
    const nonNullGetFormState: GetFormState =
      getFormState || (state => getIn(state, 'form'))
    return keys(nonNullGetFormState(state))
  }
}

export default createGetFormNames
