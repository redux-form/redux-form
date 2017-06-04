/* eslint react/no-multi-comp:0 */
import React from 'react'
import {createSpy} from 'expect'
import {Provider} from 'react-redux'
import {combineReducers as plainCombineReducers, createStore} from 'redux'
import {combineReducers as immutableCombineReducers} from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import createReducer from '../createReducer'
import createReduxForm from '../createReduxForm'
import formValues from '../formValues'
import immutableFormValues from '../immutable/formValues'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeValues = (name, formValues, structure, combineReducers, expect) => {
  const reducer = createReducer(structure)
  const reduxForm = createReduxForm(structure)
  const {fromJS} = structure
  const makeStore = initial =>
    createStore(combineReducers({form: reducer}), fromJS({form: initial}))

  const store = makeStore()

  const Form = reduxForm({
    form: 'test',
    initialValues: fromJS({
      cat: 'rat',
      sub: {dog: 'cat'}
    })
  })(props => <div {...props} />)

  const testProps = (useSection, ...config) => {
    const Spy = createSpy(() => <div />).andCallThrough()
    const Decorated = formValues(...config)(Spy)
    TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Form>
          {useSection
            ? <FormSection name="sub"><Decorated /></FormSection>
            : <Decorated />}
        </Form>
      </Provider>
    )
    expect(Spy).toHaveBeenCalled()
    return Spy.calls[0].arguments[0]
  }

  describe(name, () => {
    it('should throw on missing names', () => {
      expect(() => testProps(false)).toThrow()
      expect(() => testProps(false, {})).toThrow()
    })

    it('should throw on missing context', () => {
      const Spy = createSpy(() => <div />).andCallThrough()

      const Decorated = formValues('meep')(Spy)
      expect(() =>
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <Decorated />
          </Provider>
        )
      ).toThrow()
    })

    it('should get values from Redux state', () => {
      const props = testProps(false, 'cat', 'sub.dog')
      expect(props.cat).toEqual('rat')
      expect(props['sub.dog']).toEqual('cat')
    })

    it('should use given prop names', () => {
      const props = testProps(false, {foo: 'cat', bar: 'sub.dog'})
      expect(props.foo).toEqual('rat')
      expect(props.bar).toEqual('cat')
    })

    it('should work in FormSection', () => {
      const props = testProps(true, 'dog')
      expect(props.dog).toEqual('cat')
    })
  })
}

describeValues(
  'formValues.plain',
  formValues,
  plain,
  plainCombineReducers,
  addExpectations(plainExpectations)
)
describeValues(
  'formValues.immutable',
  immutableFormValues,
  immutable,
  immutableCombineReducers,
  addExpectations(immutableExpectations)
)
