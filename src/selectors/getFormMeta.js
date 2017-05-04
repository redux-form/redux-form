const createGetFormMeta = ({ getIn }) =>
  (form, getFormState = state => getIn(state, 'form')) =>
    state => getIn(getFormState(state), `${form}.fields`)

export default createGetFormMeta
