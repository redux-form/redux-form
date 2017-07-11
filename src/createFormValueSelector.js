// @flow
import invariant from 'invariant'
import plain from './structure/plain'
import type { Structure, GetFormState } from './types'
import type { FormValueSelectorInterface } from './formValueSelector.types.js.flow'

const createFormValueSelector = ({ getIn }: Structure<*, *>) => (
  form: string,
  getFormState: ?GetFormState
): FormValueSelectorInterface => {
  invariant(form, 'Form value must be specified')
  const nonNullGetFormState: GetFormState =
    getFormState || (state => getIn(state, 'form'))
  return (state: any, ...fields: string[]) => {
    invariant(fields.length, 'No fields specified')
    return fields.length === 1
      ? // only selecting one field, so return its value
        getIn(nonNullGetFormState(state), `${form}.values.${fields[0]}`)
      : // selecting many fields, so return an object of field values
        fields.reduce((accumulator, field) => {
          const value = getIn(
            nonNullGetFormState(state),
            `${form}.values.${field}`
          )
          return value === undefined
            ? accumulator
            : plain.setIn(accumulator, field, value)
        }, {})
  }
}

export default createFormValueSelector
