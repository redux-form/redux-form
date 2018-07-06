import type { FieldProps } from './FieldProps.types'

const removeFieldHandler = (field: FieldProps) => {
  const {
    input: { value },
    meta
  } = field
  return {
    value,
    meta
  }
}

export default removeFieldHandler
