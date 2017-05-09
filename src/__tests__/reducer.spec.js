import createReducer from '../createReducer'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'
import {prefix} from '../actionTypes'
import describeInitialize from './reducer.initialize.spec'
import describeArrayInsert from './reducer.arrayInsert.spec'
import describeArrayMove from './reducer.arrayMove.spec'
import describeArrayPop from './reducer.arrayPop.spec'
import describeArrayPush from './reducer.arrayPush.spec'
import describeArrayRemove from './reducer.arrayRemove.spec'
import describeArrayRemoveAll from './reducer.arrayRemoveAll.spec'
import describeArrayShift from './reducer.arrayShift.spec'
import describeArraySplice from './reducer.arraySplice.spec'
import describeArraySwap from './reducer.arraySwap.spec'
import describeArrayUnshift from './reducer.arrayUnshift.spec'
import describeAutofill from './reducer.autofill.spec'
import describeBlur from './reducer.blur.spec'
import describeChange from './reducer.change.spec'
import describeClearSubmit from './reducer.clearSubmit.spec'
import describeClearSubmitErrors from './reducer.clearSubmitErrors.spec'
import describeClearAsyncError from './reducer.clearAsyncError.spec'
import describeDestroy from './reducer.destroy.spec'
import describeFocus from './reducer.focus.spec'
import describeTouch from './reducer.touch.spec'
import describeReset from './reducer.reset.spec'
import describePlugin from './reducer.plugin.spec'
import describeStartSubmit from './reducer.startSubmit.spec'
import describeStopSubmit from './reducer.stopSubmit.spec'
import describeSetSubmitFailed from './reducer.setSubmitFailed.spec'
import describeSetSubmitSucceeded from './reducer.setSubmitSuceeded.spec'
import describeStartAsyncValidation from './reducer.startAsyncValidation.spec'
import describeStopAsyncValidation from './reducer.stopAsyncValidation.spec'
import describeSubmit from './reducer.submit.spec'
import describeRegisterField from './reducer.registerField.spec'
import describeUnregisterField from './reducer.unregisterField.spec'
import describeUntouch from './reducer.untouch.spec'
import describeUpdateSyncErrors from './reducer.updateSyncErrors.spec'
import describeUpdateSyncWarnings from './reducer.updateSyncWarnings.spec'

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
      const state = {foo: 'bar'}
      expect(reducer(state, {type: 'SOMETHING_ELSE'})).toBe(state)
    })

    it('should not modify state when action has form, but unknown type', () => {
      const state = {foo: 'bar'}
      expect(reducer(state, {type: 'SOMETHING_ELSE', form: 'foo'})).toBe(state)
    })

    it('should initialize form state when action has form', () => {
      const state = reducer(undefined, {
        type: `${prefix}SOME_ACTION`,
        meta: {form: 'foo'}
      })
      expect(state).toExist().toBeAMap().toBeSize(1).toEqualMap({
        foo: {}
      })
    })

    it('should ignore non-redux-form actions', () => {
      const state = reducer(undefined, {
        type: 'some/other/lib',
        meta: {form: 'foo'}
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
