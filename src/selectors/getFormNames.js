// @flow
import type { Structure, GetFormState } from '../types'
import type { GetFormNamesInterface } from './getFormNames.types'

export default function createGetFormNames<L>({ getIn, keys }: Structure<any, L>) {
  return (getFormState: ?GetFormState): GetFormNamesInterface<L> => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return keys(nonNullGetFormState(state))
    }
  }
}
