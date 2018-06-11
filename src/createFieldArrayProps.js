// @flow
import type { Structure } from './types'
import type { FieldArrayProps } from './FieldArrayProps.types'

type Props = {
  arrayInsert(index: number, value: any): void,
  arrayMove(from: number, to: number): void,
  arrayPop(): any,
  arrayPush(value: any): void,
  arrayRemove(index: number): void,
  arrayRemoveAll(): void,
  arrayShift(): any,
  arraySplice(index: number, removeNum: number | null, value: any): void,
  arraySwap(from: number, to: number): void,
  arrayUnshift(value: any): void,
  asyncError: any,
  dirty: boolean,
  length: number,
  pristine: boolean,
  submitError: any,
  state: Object,
  submitFailed: boolean,
  submitting: boolean,
  syncError: any,
  syncWarning: any,
  value: Array<any>,
  props?: Object
}

const createFieldArrayProps = (
  { getIn }: Structure<*, *>,
  name: string,
  form: string,
  sectionPrefix?: string,
  getValue: Function,
  {
    arrayInsert,
    arrayMove,
    arrayPop,
    arrayPush,
    arrayRemove,
    arrayRemoveAll,
    arrayShift,
    arraySplice,
    arraySwap,
    arrayUnshift,
    asyncError, // eslint-disable-line no-unused-vars
    dirty,
    length,
    pristine,
    submitError,
    state,
    submitFailed,
    submitting, // eslint-disable-line no-unused-vars
    syncError,
    syncWarning,
    value,
    props,
    ...rest
  }: Props
): FieldArrayProps => {
  const error = syncError || asyncError || submitError
  const warning = syncWarning
  const fieldName = sectionPrefix ? name.replace(`${sectionPrefix}.`, '') : name
  const finalProps = {
    fields: {
      _isFieldArray: true,
      forEach: callback =>
        (value || []).forEach((item, index) =>
          callback(`${fieldName}[${index}]`, index, finalProps.fields)
        ),
      get: getValue,
      getAll: () => value,
      insert: arrayInsert,
      length,
      map: callback =>
        (value || []).map((item, index) =>
          callback(`${fieldName}[${index}]`, index, finalProps.fields)
        ),
      move: arrayMove,
      name,
      pop: () => {
        arrayPop()
        return getIn(value, String(length - 1))
      },
      push: arrayPush,
      reduce: (callback, initial) =>
        (value || []).reduce(
          (accumulator, item, index) =>
            callback(
              accumulator,
              `${fieldName}[${index}]`,
              index,
              finalProps.fields
            ),
          initial
        ),
      remove: arrayRemove,
      removeAll: arrayRemoveAll,
      shift: () => {
        arrayShift()
        return getIn(value, '0')
      },
      splice: arraySplice,
      swap: arraySwap,
      unshift: arrayUnshift
    },
    meta: {
      dirty,
      error,
      form,
      warning,
      invalid: !!error,
      pristine,
      submitting,
      submitFailed,
      valid: !error
    },
    ...props,
    ...rest
  }
  return finalProps
}

export default createFieldArrayProps
