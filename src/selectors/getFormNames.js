const createGetFormNames = ({ getIn, keys }) => (
  getFormState = state => getIn(state, 'form')
) => state => keys(getFormState(state))

export default createGetFormNames
