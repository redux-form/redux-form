// @flow
import { isValidElementType } from 'react-is'

const validateComponentProp = (
  props: Object,
  propName: string,
  componentName: string
) => {
  if (!isValidElementType(props[propName])) {
    return new Error(
      'Invalid prop `' +
        propName +
        '` supplied to' +
        ' `' +
        componentName +
        '`.'
    )
  }
  return null
}

export default validateComponentProp
