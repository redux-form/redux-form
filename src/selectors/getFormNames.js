const createGetFormNames = ({ getIn, keys }) =>
  (form, getFormState = state => getIn(state, 'form')) =>
    state => keys(getFormState(state))

export default createGetFormNames
