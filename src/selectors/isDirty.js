// @flow
import createIsPristine from './isPristine'
import type { Structure, GetFormState } from '../types'
import type { IsDirtyInterface } from './isDirty.types'

export default function createIsDirty(structure: Structure<any, any>) {
  return (form: string, getFormState: ?GetFormState): IsDirtyInterface => {
    const isPristine = createIsPristine(structure)(form, getFormState)
    return (state: any, ...fields: string[]) => !isPristine(state, ...fields)
  }
}
