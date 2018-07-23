import type { FieldProps } from './FieldProps.types'
import type { FieldsProps } from './FieldsProps.types'
import { omit, get } from 'lodash'

const HANDLERS_TO_REMOVE = [
  'onChange',
  'onBlur',
  'onDrop',
  'onDragStart',
  'onFocus',
  'dispatch'
]

export const removeFieldHandlers = (field: FieldProps) => {
  const { input, meta } = field
  return {
    ...omit(input, HANDLERS_TO_REMOVE),
    ...omit(meta, HANDLERS_TO_REMOVE)
  }
}

export const removeFieldsHandlers = (fields: FieldsProps) => {
  return fields.names.reduce((acc, name) => {
    const field = Object.values(fields).find(
      field => get(field, ['input', 'name']) === name
    )

    if (!field) return acc
    return {
      ...acc,
      [name]: removeFieldHandlers(field)
    }
  }, {})
}
