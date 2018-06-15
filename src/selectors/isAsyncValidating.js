// @flow
import type { Structure, GetFormState } from '../types'
import type { IsAsyncValidatingInterface } from './isAsyncValidating.types'

const createIsAsyncValidating = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): IsAsyncValidatingInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return !!getIn(nonNullGetFormState(state), `${form}.asyncValidating`)
}

export default createIsAsyncValidating
