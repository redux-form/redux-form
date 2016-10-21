import createReducer from './reducer'
import createReduxForm from './reduxForm'
import createField from './Field'
import createFields from './Fields'
import createFieldArray from './FieldArray'
import createFormValueSelector from './formValueSelector'
import createValues from './values'
import createGetFormValues from './selectors/getFormValues'
import createGetFormSyncErrors from './selectors/getFormSyncErrors'
import createIsDirty from './selectors/isDirty'
import createIsInvalid from './selectors/isInvalid'
import createIsPristine from './selectors/isPristine'
import createIsValid from './selectors/isValid'
import FormSection from './FormSection'
import SubmissionError from './SubmissionError'
import propTypes from './propTypes'
import * as actions from './actions'
import * as actionTypes from './actionTypes'

const createAll = structure => ({
  // separate out field actions
  actionTypes,
  ...actions,
  Field: createField(structure),
  Fields: createFields(structure),
  FieldArray: createFieldArray(structure),
  FormSection: FormSection,
  formValueSelector: createFormValueSelector(structure),
  getFormValues: createGetFormValues(structure),
  getFormSyncErrors: createGetFormSyncErrors(structure),
  isDirty: createIsDirty(structure),
  isInvalid: createIsInvalid(structure),
  isPristine: createIsPristine(structure),
  isValid: createIsValid(structure),
  propTypes,
  reduxForm: createReduxForm(structure),
  reducer: createReducer(structure),
  SubmissionError,
  values: createValues(structure)
})

export default createAll
