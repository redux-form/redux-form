import bindActionData from './bindActionData'
import createReducer from './reducer'
import createReduxForm from './reduxForm'
import createField from './Field'
import createValues from './values'
import SubmissionError from './SubmissionError'
import mapValues from './util/mapValues'
import propTypes from './propTypes'
import * as actions from './actions'
import * as actionTypes from './actionTypes'

export default function createAll(structure) {
  // separate out field actions
  const { blur, change, focus, startAsyncValidation, ...nonFieldActions } = actions
  return {
    actionTypes,
    // bind form as first parameter of action creators
    ...mapValues({
      // bind field as second parameter of field action creators
      ...mapValues({
        blur,
        change,
        focus,
        startAsyncValidation
      }, action => (field, ...args) => bindActionData(action, { field })(...args)),
      ...nonFieldActions
    }, action => (form, ...args) => bindActionData(action, { form })(...args)),
    Field: createField(structure),
    propTypes,
    reduxForm: createReduxForm(structure),
    reducer: createReducer(structure),
    SubmissionError,
    values: createValues(structure)
  }
}

