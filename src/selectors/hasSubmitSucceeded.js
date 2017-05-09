const createHasSubmitSucceeded = ({getIn}) => (
  form,
  getFormState = state => getIn(state, 'form')
) => state => {
  const formState = getFormState(state)
  return getIn(formState, `${form}.submitSucceeded`) || false
}

export default createHasSubmitSucceeded
