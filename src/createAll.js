import createReducer from './reducer'
import createReduxForm from './reduxForm'
import createField from './Field'
import createFieldArray from './FieldArray'
import createValues from './values'
import SubmissionError from './SubmissionError'
import propTypes from './propTypes'
import * as actions from './actions'
import * as actionTypes from './actionTypes'

export default function createAll(structure) {
  // separate out field actions
  return {
    actionTypes,
    ...actions,
    Field: createField(structure),
    FieldArray: createFieldArray(structure),
    propTypes,
    reduxForm: createReduxForm(structure),
    reducer: createReducer(structure),
    SubmissionError,
    values: createValues(structure)
  }
}

