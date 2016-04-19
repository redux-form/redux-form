const createDeleteInWithCleanUp = ({ deepEqual, empty, getIn, deleteIn }) => {

  const deleteInWithCleanUp = (state, path) => {
    const result = deleteIn(state, path)
    const dotIndex = path.lastIndexOf('.')
    if (dotIndex > 0) {
      const parentPath = path.substring(0, dotIndex)
      const parent = getIn(result, parentPath)
      if (deepEqual(parent, empty)) {
        return deleteInWithCleanUp(result, parentPath)
      }
    }
    return result
  }

  return deleteInWithCleanUp
}

export default createDeleteInWithCleanUp
