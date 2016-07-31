const createGetFormValues = ({ getIn }) =>
  (form, getFormState = state => getIn(state, 'form')) =>
    state => getIn(getFormState(state), `${form}.values`)

export default createGetFormValues
