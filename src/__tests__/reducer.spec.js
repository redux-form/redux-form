import createReducer from '../createReducer'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'
import { prefix } from '../actionTypes'

import describeInitialize from './helpers/reducer.initialize'
import describeArrayInsert from './helpers/reducer.arrayInsert'
import describeArrayMove from './helpers/reducer.arrayMove'
import describeArrayPop from './helpers/reducer.arrayPop'
import describeArrayPush from './helpers/reducer.arrayPush'
import describeArrayRemove from './helpers/reducer.arrayRemove'
import describeArrayRemoveAll from './helpers/reducer.arrayRemoveAll'
import describeArrayShift from './helpers/reducer.arrayShift'
import describeArraySplice from './helpers/reducer.arraySplice'
import describeArraySwap from './helpers/reducer.arraySwap'
import describeArrayUnshift from './helpers/reducer.arrayUnshift'
import describeAutofill from './helpers/reducer.autofill'
import describeBlur from './helpers/reducer.blur'
import describeChange from './helpers/reducer.change'
import describeClearSubmit from './helpers/reducer.clearSubmit'
import describeClearSubmitErrors from './helpers/reducer.clearSubmitErrors'
import describeClearAsyncError from './helpers/reducer.clearAsyncError'
import describeDestroy from './helpers/reducer.destroy'
import describeFocus from './helpers/reducer.focus'
import describeTouch from './helpers/reducer.touch'
import describeReset from './helpers/reducer.reset'
import describePlugin from './helpers/reducer.plugin'
import describeStartSubmit from './helpers/reducer.startSubmit'
import describeStopSubmit from './helpers/reducer.stopSubmit'
import describeSetSubmitFailed from './helpers/reducer.setSubmitFailed'
import describeSetSubmitSucceeded from './helpers/reducer.setSubmitSuceeded'
import describeStartAsyncValidation from './helpers/reducer.startAsyncValidation'
import describeStopAsyncValidation from './helpers/reducer.stopAsyncValidation'
import describeSubmit from './helpers/reducer.submit'
import describeRegisterField from './helpers/reducer.registerField'
import describeUnregisterField from './helpers/reducer.unregisterField'
import describeUntouch from './helpers/reducer.untouch'
import describeUpdateSyncErrors from './helpers/reducer.updateSyncErrors'
import describeUpdateSyncWarnings from './helpers/reducer.updateSyncWarnings'

const tests = {
  initialize: describeInitialize,
  arrayInsert: describeArrayInsert,
  arrayMove: describeArrayMove,
  arrayPop: describeArrayPop,
  arrayPush: describeArrayPush,
  arrayRemove: describeArrayRemove,
  arrayRemoveAll: describeArrayRemoveAll,
  arrayShift: describeArrayShift,
  arraySplice: describeArraySplice,
  arraySwap: describeArraySwap,
  arrayUnshift: describeArrayUnshift,
  autofill: describeAutofill,
  blur: describeBlur,
  change: describeChange,
  clearSubmit: describeClearSubmit,
  clearSubmitErrors: describeClearSubmitErrors,
  clearAsyncError: describeClearAsyncError,
  destroy: describeDestroy,
  focus: describeFocus,
  reset: describeReset,
  touch: describeTouch,
  setSubmitFailed: describeSetSubmitFailed,
  setSubmitSucceeded: describeSetSubmitSucceeded,
  startSubmit: describeStartSubmit,
  stopSubmit: describeStopSubmit,
  startAsyncValidation: describeStartAsyncValidation,
  stopAsyncValidation: describeStopAsyncValidation,
  submit: describeSubmit,
  registerField: describeRegisterField,
  unregisterField: describeUnregisterField,
  untouch: describeUntouch,
  updateSyncErrors: describeUpdateSyncErrors,
  updateSyncWarnings: describeUpdateSyncWarnings,
  plugin: describePlugin
}

const describeReducer = (name, structure, expect) => {
  const reducer = createReducer(structure)

  describe(name, () => {
    it('should initialize state to {}', () => {
      const state = reducer()
      expect(state).toExist().toBeAMap().toBeSize(0)
    })

    it('should not modify state when action has no form', () => {
      const state = { foo: 'bar' }
      expect(reducer(state, { type: 'SOMETHING_ELSE' })).toBe(state)
    })

    it('should not modify state when action has form, but unknown type', () => {
      const state = { foo: 'bar' }
      expect(reducer(state, { type: 'SOMETHING_ELSE', form: 'foo' })).toBe(
        state
      )
    })

    it('should initialize form state when action has form', () => {
      const state = reducer(undefined, {
        type: `${prefix}SOME_ACTION`,
        meta: { form: 'foo' }
      })
      expect(state).toExist().toBeAMap().toBeSize(1).toEqualMap({
        foo: {}
      })
    })

    it('should ignore non-redux-form actions', () => {
      const state = reducer(undefined, {
        type: 'some/other/lib',
        meta: { form: 'foo' }
      })
      expect(state).toEqualMap({})
    })

    Object.keys(tests).forEach(key => {
      describe(`${name}.${key}`, tests[key](reducer, expect, structure))
    })
  })
}
describeReducer('reducer.plain', plain, addExpectations(plainExpectations))
describeReducer(
  'reducer.immutable',
  immutable,
  addExpectations(immutableExpectations)
)
