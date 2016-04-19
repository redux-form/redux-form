import { combineReducers } from 'redux-immutablejs'
import { reducer as formReducer } from 'redux-form/immutable' // <--- immutable import
import validate from './validate'

const reducer = combineReducers({
  form: formReducer.validation({
    immutableExample: validate // "immutableExample" is the form name given to reduxForm() decorator
  })
})

export default reducer
