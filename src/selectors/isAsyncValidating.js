// @flow
import type { Structure, GetFormState } from '../types'
import type { IsAsyncValidatingInterface } from './isAsyncValidating.types'

export default function createIsAsyncValidating({ getIn }: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): IsAsyncValidatingInterface => {
    return (state: any) => {
      const nonNullGetFormState: GetFormState = getFormState || (state => getIn(state, 'form'))
      return !!getIn(nonNullGetFormState(state), `${form}.asyncValidating`)
    }
  }
}
