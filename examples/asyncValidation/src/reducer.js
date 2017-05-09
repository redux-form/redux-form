import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import validate from './validate'

const reducer = combineReducers({
  form: formReducer.validation({
    asyncValidation: validate // "asyncValidation" is the form name given to reduxForm() decorator
  })
})

export default reducer
