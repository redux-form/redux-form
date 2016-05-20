/* eslint react/no-multi-comp:0 */
import React from 'react'
import { createSpy } from 'expect'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-addons-test-utils'
import createReducer from '../reducer'
import createValues from '../values'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeValues = (name, structure, combineReducers, expect) => {
  const values = createValues(structure)
  const reducer = createReducer(structure)
  const { fromJS } = structure
  const makeStore = (initial) => createStore(
    combineReducers({ form: reducer }), fromJS({ form: initial }))

  const testProps = (state, config = {}) => {
    const store = makeStore({ testForm: state })
    const spy = createSpy(() => <div/>).andCallThrough()

    const Decorated = values({ form: 'testForm', ...config })(spy)
    TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    )
    expect(spy).toHaveBeenCalled()
    return spy.calls[0].arguments[0]
  }

  describe(name, () => {
    it('should get values from Redux state', () => {
      const values = {
        cat: 'rat',
        dog: 'cat'
      }
      const props = testProps({ values })
      expect(props.values).toEqualMap(values)
    })

    it('should use values prop', () => {
      const values = {
        cat: 'rat',
        dog: 'cat'
      }
      const props = testProps({ values }, { prop: 'foo' })
      expect(props.foo).toEqualMap(values)
    })
  })
}

describeValues('values.plain', plain, plainCombineReducers, addExpectations(plainExpectations))
describeValues('values.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations))
