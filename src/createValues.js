import {connect} from 'react-redux'

const createValues = ({getIn}) => config => {
  const {form, prop, getFormState} = {
    prop: 'values',
    getFormState: state => getIn(state, 'form'),
    ...config,
  }
  return connect(
    state => ({
      [prop]: getIn(getFormState(state), `${form}.values`),
    }),
    () => ({}) // ignore dispatch
  )
}

export default createValues
