import createReducer from './reducer'
import createReduxForm from './reduxForm'
import createField from './Field'
import createFieldArray from './FieldArray'
import createFormValueSelector from './formValueSelector'
import createValues from './values'
import SubmissionError from './SubmissionError'
import propTypes from './propTypes'
import * as actions from './actions'
import * as actionTypes from './actionTypes'

const createAll = structure => ({
  // separate out field actions
  actionTypes,
  ...actions,
  Field: createField(structure),
  FieldArray: createFieldArray(structure),
  formValueSelector: createFormValueSelector(structure),
  propTypes,
  reduxForm: createReduxForm(structure),
  reducer: createReducer(structure),
  SubmissionError,
  values: createValues(structure)
})

export default createAll
