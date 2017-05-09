import {combineReducers} from 'redux-immutablejs'
import {reducer as form} from 'redux-form/immutable' // <--- immutable import

const reducer = combineReducers({form})

export default reducer
