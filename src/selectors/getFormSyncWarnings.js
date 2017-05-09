const createGetFormSyncWarnings = ({getIn}) => (
  form,
  getFormState = state => getIn(state, 'form')
) => state => getIn(getFormState(state), `${form}.syncWarnings`)

export default createGetFormSyncWarnings
