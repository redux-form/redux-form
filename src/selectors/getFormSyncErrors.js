const createGetFormSyncErrors = ({ getIn }) =>
  (form, getFormState = state => getIn(state, 'form')) =>
    state => getIn(getFormState(state), `${form}.syncErrors`)

export default createGetFormSyncErrors
