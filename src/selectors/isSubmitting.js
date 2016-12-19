const createIsSubmitting = ({ getIn }) =>
  (form, getFormState = state => getIn(state, 'form')) =>
    state => {
      const formState = getFormState(state)
      return getIn(formState, `${form}.submitting`) || false
    }

export default createIsSubmitting
