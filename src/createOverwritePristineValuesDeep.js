import traverse from 'traverse'

import mergeDeep from './util/mergeDeep'

const createOverwritePristineValuesDeep = ({ getIn, deepEqual }) => (
  values,
  initialValues,
  newInitialValues
) => {
  const isDirty = (value, initialValue) => !deepEqual(value, initialValue)

  const newValues = traverse(mergeDeep(values, newInitialValues)).map(function(
    mergedValue
  ) {
    if (this.notLeaf && !Array.isArray(mergedValue)) {
      return mergedValue
    }

    const initialValue = getIn(initialValues, this.path)
    const value = getIn(values, this.path)
    const newInitialValue = getIn(newInitialValues, this.path)

    const isDirtyOurs = isDirty(value, initialValue)
    const wasDeleted = value && !newInitialValue

    if (!isDirtyOurs && !wasDeleted) {
      return this.update(mergedValue)
    } else if (!isDirtyOurs && wasDeleted) {
      return this.delete()
    } else if (isDirtyOurs) {
      return this.update(value)
    }

    // Else if newInitialValue but dirty, then dispatch action with content information
    // So the user can accept this change
  })

  return newValues
}

export default createOverwritePristineValuesDeep
