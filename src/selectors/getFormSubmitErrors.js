const createGetFormSubmitErrors = ({getIn}) => (
  form,
  getFormState = state => getIn(state, 'form')
) => state => getIn(getFormState(state), `${form}.submitErrors`)

export default createGetFormSubmitErrors
