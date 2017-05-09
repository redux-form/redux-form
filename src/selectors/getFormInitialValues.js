const createGetFormInitialValues = ({ getIn }) => (
  form,
  getFormState = state => getIn(state, 'form')
) => state => getIn(getFormState(state), `${form}.initial`)

export default createGetFormInitialValues
