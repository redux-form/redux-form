import type { FieldProps } from './FieldProps.types'
import type { FieldsProps } from './FieldsProps.types'
import { omit } from 'lodash'

const HANDLERS_TO_REMOVE = [
  'onChange',
  'onBlur',
  'onDrop',
  'onDragStart',
  'onFocus'
]

export const removeFieldHandlers = (field: FieldProps) => {
  const { input, meta } = field
  const inputWithoutHanlders = omit(input, HANDLERS_TO_REMOVE)
  return {
    ...inputWithoutHanlders,
    ...meta
  }
}

export const removeFieldsHandlers = (fields: FieldsProps) => {
  return fields.names.reduce((acc, curr) => {
    const field = fields[curr]
    return field
      ? {
          ...acc,
          [curr]: removeFieldHandlers(field)
        }
      : acc
  }, {})
}
