const createHasSubmitFailed = ({getIn}) => (
  form,
  getFormState = state => getIn(state, 'form')
) => state => {
  const formState = getFormState(state)
  return getIn(formState, `${form}.submitFailed`) || false
}

export default createHasSubmitFailed
