// @flow
import type { Structure, GetFormState } from '../types'
import type { IsPristineInterface } from './isPristine.types.js.flow'

const createIsPristine = ({ deepEqual, empty, getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): IsPristineInterface => (state: any) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  const formState = nonNullGetFormState(state)
  const initial = getIn(formState, `${form}.initial`) || empty
  const values = getIn(formState, `${form}.values`) || initial
  return deepEqual(initial, values)
}

export default createIsPristine
