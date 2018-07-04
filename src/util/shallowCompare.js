// @flow
import { isEqualWith } from 'lodash'

const customizer = (
  objectValue,
  otherValue,
  indexOrkey,
  object,
  other,
  stack
) => {
  // https://lodash.com/docs/4.17.4#isEqualWith
  if (stack) {
    // Shallow compares
    // For 1st level, stack === undefined.
    //   -> Do nothing (and implicitly return undefined so that it goes to compare 2nd level)
    // For 2nd level and up, stack !== undefined.
    //   -> Compare by === operator
    return objectValue === otherValue
  }
}

const shallowCompare = (
  instance: { props: any, state?: any },
  nextProps: Object,
  nextState?: Object
): boolean => {
  const propsEqual = isEqualWith(instance.props, nextProps, customizer)
  const stateEqual = isEqualWith(instance.state, nextState, customizer)

  return !propsEqual || !stateEqual
}

export default shallowCompare
