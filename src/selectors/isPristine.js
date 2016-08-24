const createIsPristine = ({ deepEqual, empty, getIn }) =>
  (form, getFormState = state => getIn(state, 'form')) =>
    state => {
      const formState = getFormState(state)
      const initial = getIn(formState, `${form}.initial`) || empty
      const values = getIn(formState, `${form}.values`) || initial
      const setDirty = getIn(formState, `${form}.setDirty`) || false
      return deepEqual(initial, values) && !setDirty
    }

export default createIsPristine
