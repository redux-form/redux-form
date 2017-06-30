// @flow
import type { Structure, GetFormState } from '../types'

const createIsPristine = ({ deepEqual, empty, getIn }: Structure<*, *>) => (
  form: string,
  getFormState: GetFormState = state => getIn(state, 'form')
) => (state: any) => {
  const formState = getFormState(state)
  const initial = getIn(formState, `${form}.initial`) || empty
  const values = getIn(formState, `${form}.values`) || initial
  return deepEqual(initial, values)
}

export default createIsPristine
