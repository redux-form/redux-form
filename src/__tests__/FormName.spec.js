/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutable'
import TestUtils from 'react-dom/test-utils'
import createReduxForm from '../createReduxForm'
import createReducer from '../createReducer'
import FormName from '../FormName'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'

const describeFormName = (name, structure, combineReducers, setup) => {
  const reduxForm = createReduxForm(structure)
  const reducer = createReducer(structure)
  const { fromJS } = structure
  const makeStore = (initial = {}, logger) => {
    const reducers = { form: reducer }
    if (logger) {
      reducers.logger = logger
    }
    return createStore(combineReducers(reducers), fromJS({ form: initial }))
  }

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should pass name to child function and render what it returns', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 42
          }
        }
      })
      class TestForm extends Component {
        render() {
          return (
            <form>
              <FormName>{({ form }) => <h1>Form name: {form}</h1>}</FormName>
            </form>
          )
        }
      }
      const DecoratedTestForm = reduxForm({ form: 'testForm' })(TestForm)
      const comp = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <DecoratedTestForm />
        </Provider>
      )

      expect(findDOMNode(comp).outerHTML).toBe('<form><h1>Form name: testForm</h1></form>')
    })
  })
}

describeFormName('FormName.plain', plain, plainCombineReducers, () =>
  expect.extend(plainExpectations)
)
describeFormName('FormName.immutable', immutable, immutableCombineReducers, () =>
  expect.extend(immutableExpectations)
)
