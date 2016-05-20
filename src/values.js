import { connect } from 'react-redux'

const createValues = ({ empty, getIn }) =>
  config => {
    const { form, prop, getFormState } = {
      prop: 'values',
      getFormState: state => getIn(state, 'form'),
      ...config
    }
    return connect(
      state => ({
        [prop]: getIn(getFormState(state), `${form}.values`)
      }),
      dispatch => ({})
    )
  }

export default createValues
