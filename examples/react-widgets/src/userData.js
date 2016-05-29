// Quack! This is a duck. https://github.com/erikras/ducks-modular-redux
const LOAD_USERDATA = 'redux-form-examples/data/LOAD_USERDATA'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_USERDATA:
      return {
        data: action.data
      }
    default:
      return state
  }
}

/**
 * Simulates data loaded into this reducer from somewhere
 */
export function load(data) {
  return {
    type: LOAD_USERDATA,
    data
  }
}

export default reducer
