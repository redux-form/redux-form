// @flow
import type { Structure } from './types'

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

export type Fields = {
  _isFieldArray: boolean,
  forEach(callback: Function): void,
  get(index: number): any,
  getAll(): Array<any>,
  insert(index: number, value: any): void,
  length: number,
  map(callback: Function): Array<any>,
  move(from: number, to: number): void,
  name: string,
  pop(): any,
  push(value: any): void,
  reduce(callback: Function): any,
  remove(index: number): void,
  removeAll(): void,
  shift(): any,
  some(callback: Function): boolean,
  swap(from: number, to: number): void,
  unshift(value: any): void
}

type Result = {
  fields: Fields,
  meta: {
    dirty: boolean,
    error: any,
    warning: any,
    invalid: boolean,
    pristine: boolean,
    submitting: boolean,
    submitFailed: boolean,
    touched: boolean,
    valid: boolean
  },
  ref?: string
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
): Result => {
  const error = syncError || asyncError || submitError
  const warning = syncWarning
  const fieldName = sectionPrefix ? name.replace(`${sectionPrefix}.`, '') : name
  const finalProps = {
    fields: {
      _isFieldArray: true,
      forEach: callback =>
        (value || [])
          .forEach((item, index) =>
            callback(`${fieldName}[${index}]`, index, finalProps.fields)
          ),
      get: getValue,
      getAll: () => value,
      insert: arrayInsert,
      length,
      map: callback =>
        (value || [])
          .map((item, index) =>
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
        (value || [])
          .reduce(
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
