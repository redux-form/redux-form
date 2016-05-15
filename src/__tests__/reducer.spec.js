import createReducer from '../reducer'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'
import describeInitialize from './reducer.initialize.spec'
import describeArrayInsert from './reducer.arrayInsert.spec'
import describeArrayPop from './reducer.arrayPop.spec'
import describeArrayPush from './reducer.arrayPush.spec'
import describeArrayRemove from './reducer.arrayRemove.spec'
import describeArrayShift from './reducer.arrayShift.spec'
import describeArraySplice from './reducer.arraySplice.spec'
import describeArraySwap from './reducer.arraySwap.spec'
import describeArrayUnshift from './reducer.arrayUnshift.spec'
import describeBlur from './reducer.blur.spec'
import describeChange from './reducer.change.spec'
import describeDestroy from './reducer.destroy.spec'
import describeFocus from './reducer.focus.spec'
import describeTouch from './reducer.touch.spec'
import describeUntouch from './reducer.untouch.spec'
import describeReset from './reducer.reset.spec'
import describeStartSubmit from './reducer.startSubmit.spec'
import describeStopSubmit from './reducer.stopSubmit.spec'
import describeSetSubmitFailed from './reducer.setSubmitFailed.spec'
import describeStartAsyncValidation from './reducer.startAsyncValidation.spec'
import describeStopAsyncValidation from './reducer.stopAsyncValidation.spec'
import describeRegisterField from './reducer.registerField.spec'
import describeUnregisterField from './reducer.unregisterField.spec'

const tests = {
  initialize: describeInitialize,
  arrayInsert: describeArrayInsert,
  arrayPop: describeArrayPop,
  arrayPush: describeArrayPush,
  arrayRemove: describeArrayRemove,
  arrayShift: describeArrayShift,
  arraySplice: describeArraySplice,
  arraySwap: describeArraySwap,
  arrayUnshift: describeArrayUnshift,
  blur: describeBlur,
  change: describeChange,
  destroy: describeDestroy,
  focus: describeFocus,
  reset: describeReset,
  touch: describeTouch,
  untouch: describeUntouch,
  setSubmitFailed: describeSetSubmitFailed,
  startSubmit: describeStartSubmit,
  stopSubmit: describeStopSubmit,
  startAsyncValidation: describeStartAsyncValidation,
  stopAsyncValidation: describeStopAsyncValidation,
  registerField: describeRegisterField,
  unregisterField: describeUnregisterField
}

const describeReducer = (name, structure, expect) => {
  const reducer = createReducer(structure)

  describe(name, () => {
    it('should initialize state to {}', () => {
      const state = reducer()
      expect(state)
        .toExist()
        .toBeAMap()
        .toBeSize(0)
    })

    it('should not modify state when action has no form', () => {
      const state = { foo: 'bar' }
      expect(reducer(state, { type: 'SOMETHING_ELSE' })).toBe(state)
    })

    it('should initialize form state when action has form', () => {
      const state = reducer(undefined, { meta: { form: 'foo' } })
      expect(state)
        .toExist()
        .toBeAMap()
        .toBeSize(1)
        .toEqualMap({
          foo: {}
        })
    })

    Object.keys(tests).forEach(key => {
      describe(`${name}.${key}`, tests[ key ](reducer, expect, structure))
    })
  })
}
describeReducer('reducer.plain', plain, addExpectations(plainExpectations))
describeReducer('reducer.immutable', immutable, addExpectations(immutableExpectations))
