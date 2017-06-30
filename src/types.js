// @flow
import type { Map as ImmutableMap } from 'immutable'
import type { Component } from 'react'

export type ComponentClass<DefaultProps, Props> = Class<
  React$Component<DefaultProps, Props, *>
>

export type Action = {
  type: string,
  meta?: any,
  payload?: any,
  error?: any
}

export interface Structure<M, L> {
  allowsArrayErrors: boolean,
  empty: M,
  emptyList: L,
  getIn(state: any, field: string): any,
  setIn(state: any, field: string, value: any): any,
  deepEqual(a: any, b: any): boolean,
  deleteIn(state: any, field: string): any,
  forEach(list: L, callback: { (item: any, index: number): void }): void,
  fromJS(value: any): any,
  keys(value: M): L,
  size(array: L): number,
  some(list: L, callback: { (item: any, index: number): boolean }): boolean,
  splice(array: L, index: number, removeNum: number, value: any): L,
  toJS(value: M): any
}

export type FieldType = 'Field' | 'FieldArray'

export type Values = Object | ImmutableMap<string, *> | any[]

export type GetFormState = { (state: any): any }

export type ConnectedComponent<T: Component<*, *, *>> = {
  getWrappedInstance: { (): T }
} & Component<*, *, *>

export type Option = {
  selected: boolean,
  value: any
}

export type Event = {
  preventDefault(): void,
  stopPropagation(): void,
  target: {
    value: any,
    type: string,
    options?: Array<Option>,
    checked?: boolean,
    files?: Array<Object>
  },
  dataTransfer: {
    files: Array<Object>,
    getData: { (key: string): any },
    setData: { (key: string, data: any): void }
  },
  nativeEvent?: {
    text?: string
  }
}

export type Context = {
  form: string,
  getFormState: GetFormState,
  asyncValidate: { (name: ?string, value: ?any): Promise<*> },
  getValues: { (): Object },
  sectionPrefix?: string,
  register: {
    (
      name: string,
      type: string,
      getValidator?: { (): ?Function },
      getWarner?: { (): ?Function }
    ): void
  },
  unregister: { (name: string): void },
  registerInnerOnSubmit: { (innerOnSubmit: Function): void },
  focus: { (name: string): void },
  change: { (name: string, value: any): void },
  blur: { (name: string, value: any): void }
}

export type ReactContext = {
  _reduxForm: Context
}
