/* eslint react/no-multi-comp:0 */
import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import ReactDOM from 'react-dom'
import createReducer from '../createReducer'
import createReduxForm from '../createReduxForm'
import formValues from '../formValues'
import immutableFormValues from '../immutable/formValues'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'


const describeValues = (
  name,
  formValues,
  structure,
  combineReducers,
  setup
) => {
  const reducer = createReducer(structure)
  const reduxForm = createReduxForm(structure)
  const { fromJS } = structure
  const makeStore = initial =>
    createStore(combineReducers({ form: reducer }), fromJS({ form: initial }))

  const store = makeStore()

  const Form = reduxForm({
    form: 'test',
    initialValues: fromJS({
      cat: 'rat',
      sub: { dog: 'cat' },
      arr: [
        {
          rat: 'cat'
        },
        {
          rat: 'dog'
        }
      ]
    })
  })(props => <div {...props} />)

  const testProps = (useSection, ...config) => {
    const Spy = jest.fn(() => <div />)
    const Decorated = formValues(...config)(Spy)
    TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Form>
          {useSection
            ? <FormSection name="sub">
                <Decorated />
              </FormSection>
            : <Decorated fooFormFieldName="cat" barFormFieldName="sub.dog" />}
        </Form>
      </Provider>
    )
    expect(Spy).toHaveBeenCalled()
    return Spy.mock.calls[0][0]
  }

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should throw on missing names', () => {
      expect(() => testProps(false)).toThrow()
      expect(() => testProps(false, {})).toThrow()
      expect(() => testProps(false, () => {})).toThrow()
      expect(() => testProps(false, () => ({}))).toThrow()
    })

    it('should throw on missing context', () => {
      const Spy = jest.fn(() => <div />)

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
      const props = testProps(false, { foo: 'cat', bar: 'sub.dog' })
      expect(props.foo).toEqual('rat')
      expect(props.bar).toEqual('cat')
    })

    it('should get values from Redux state when using a value mapper function', () => {
      const props = testProps(false, (props) => props.fooFormFieldName)
      expect(props.cat).toEqual('rat')
    })

    it('should use given prop names when using a value mapper function', () => {
      const props = testProps(false, (props) => ({ foo: props.fooFormFieldName, bar: props.barFormFieldName }))
      expect(props.foo).toEqual('rat')
      expect(props.bar).toEqual('cat')
    })

    it('should work in FormSection', () => {
      const props = testProps(true, 'dog')
      expect(props.dog).toEqual('cat')
    })

    it('should update props when FormSection name changes', () => {
      const node = document.createElement('div')
      const Spy = jest.fn(() => <div />)
      const Decorated = formValues('rat')(Spy)

      const Component = ({ name }) =>
        <Provider store={store}>
          <Form>
            <FormSection name={name}>
              <Decorated />
            </FormSection>
          </Form>
        </Provider>

      ReactDOM.render(<Component name="arr[0]" />, node)

      ReactDOM.render(<Component name="arr[1]" />, node)

      expect(Spy.mock.calls.length).toEqual(2)

      expect(Spy.mock.calls[0][0].rat).toEqual('cat')
      expect(Spy.mock.calls[1][0].rat).toEqual('dog')
    })
  })
}

describeValues(
  'formValues.plain',
  formValues,
  plain,
  plainCombineReducers,
  () => expect.extend(plainExpectations)
)
describeValues(
  'formValues.immutable',
  immutableFormValues,
  immutable,
  immutableCombineReducers,
  () => expect.extend(immutableExpectations)
)
