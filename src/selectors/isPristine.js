// @flow
import type { Structure, GetFormState } from '../types'
import type { IsPristineInterface } from './isPristine.types'

const createIsPristine = ({ deepEqual, empty, getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): IsPristineInterface => (state: any, ...fields: string[]) => {
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  const formState = nonNullGetFormState(state)
  if (fields && fields.length) {
    return fields.every(field => {
      const fieldInitial = getIn(formState, `${form}.initial.${field}`)
      const fieldValue = getIn(formState, `${form}.values.${field}`)
      return deepEqual(fieldInitial, fieldValue)
    })
  }
  const initial = getIn(formState, `${form}.initial`) || empty
  const values = getIn(formState, `${form}.values`) || initial
  return deepEqual(initial, values)
}

export default createIsPristine
