/* eslint react/no-multi-comp:0 */
import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import createReducer from '../createReducer'
import createValues from '../createValues'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'


const describeValues = (name, structure, combineReducers, setup) => {
  const values = createValues(structure)
  const reducer = createReducer(structure)
  const { fromJS } = structure
  const makeStore = initial =>
    createStore(combineReducers({ form: reducer }), fromJS({ form: initial }))

  const testProps = (state, config = {}) => {
    const store = makeStore({ testForm: state })
    const spy = jest.fn(() => <div />)

    const Decorated = values({ form: 'testForm', ...config })(spy)
    TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated />
      </Provider>
    )
    expect(spy).toHaveBeenCalled()
    return spy.mock.calls[0][0]
  }

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

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

describeValues(
  'values.plain',
  plain,
  plainCombineReducers,
  () => expect.extend(plainExpectations)
)
describeValues(
  'values.immutable',
  immutable,
  immutableCombineReducers,
  () => expect.extend(immutableExpectations)
)
