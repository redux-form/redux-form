// @flow
import type { Structure, Values } from './types'
import type { Props } from './createReduxForm'

export type Params = {
  values: Values,
  nextProps: ?Props,
  props: Props,
  initialRender: boolean,
  lastFieldValidatorKeys: string[],
  fieldValidatorKeys: string[],
  structure: Structure<any, any>
}

const defaultShouldWarn = ({
  values,
  nextProps,
  // props,  // not used in default implementation
  initialRender,
  lastFieldValidatorKeys,
  fieldValidatorKeys,
  structure
}: Params): boolean => {
  if (initialRender) {
    return true
  }
  return (
    !structure.deepEqual(values, nextProps && nextProps.values) ||
    !structure.deepEqual(lastFieldValidatorKeys, fieldValidatorKeys)
  )
}

export default defaultShouldWarn
