/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import createReduxForm from '../createReduxForm'
import createReducer from '../createReducer'
import createField from '../createField'
import createQueryField from '../createQueryField'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'

const testFormName = 'testForm'

const describeQueryField = (name, structure, combineReducers, setup) => {
  const reduxForm = createReduxForm(structure)
  const Field = createField(structure)
  const QueryField = createQueryField(structure)
  const reducer = createReducer(structure)
  const { fromJS } = structure
  const makeStore = initial =>
    createStore(combineReducers({ form: reducer }), fromJS({ form: initial }))

  class TestInput extends Component {
    render() {
      return <div>TEST INPUT</div>
    }
  }

  const testProps = (state, config = {}) => {
    const store = makeStore({ [testFormName]: state })
    class Form extends Component {
      render() {
        return (
          <div>
            <QueryField name="foo">
              {data => <TestInput {...data} />}
            </QueryField>
          </div>
        )
      }
    }
    const TestForm = reduxForm({ form: testFormName, ...config })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    return TestUtils.findRenderedComponentWithType(dom, TestInput).props
  }

  describe(name, () => {
    beforeAll(() => {
      setup()
    })

    it('should throw an error if not in ReduxForm', () => {
      expect(() => {
        TestUtils.renderIntoDocument(
          <div>
            <QueryField name="foo" render={TestInput} />
          </div>
        )
      }).toThrow(/must be used inside a React tree decorated with reduxForm()/)
    })

    it('should throw an error if invalid component prop is provided', () => {
      const store = makeStore()
      const notAComponent = {}
      class Form extends Component {
        render() {
          return <QueryField name="foo" render={notAComponent} />
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      expect(() => {
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <TestForm />
          </Provider>
        )
      }).toThrow(/Expected a function/)
    })

    it('should get value from Redux state', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      })

      expect(props.value).toBe('bar')
    })

    it('should get initial value from Redux state', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      })
      expect(props.initial).toBe('bar')
    })

    it('should get dirty/pristine from Redux state', () => {
      const props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      })

      expect(props1.pristine).toBe(true)
      expect(props1.dirty).toBe(false)

      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      })

      expect(props2.pristine).toBe(false)
      expect(props2.dirty).toBe(true)

      const props3 = testProps({
        initial: {
          foo: [4, 'abc', { def: null, key: [-45, '...', [0, 99]] }]
        },
        values: {
          foo: [4, 'abc', { def: null, key: [-45, '...', [0, 99]] }]
        }
      })

      expect(props3.pristine).toBe(true)
      expect(props3.dirty).toBe(false)
    })

    it('should allow an empty value from Redux state to be pristine', () => {
      const props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: ''
        }
      })

      expect(props1.pristine).toBe(false)
      expect(props1.dirty).toBe(true)

      const props2 = testProps({
        initial: {
          foo: ''
        },
        values: {
          foo: ''
        }
      })

      expect(props2.pristine).toBe(true)
      expect(props2.dirty).toBe(false)
    })

    it('should get asyncValidating from Redux state', () => {
      const props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        asyncValidating: 'dog'
      })

      expect(props1.asyncValidating).toBe(false)

      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        },
        asyncValidating: 'foo'
      })

      expect(props2.asyncValidating).toBe(true)
    })

    it('should get active from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })

      expect(props1.active).toBe(false)

      const props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            active: true
          }
        }
      })

      expect(props2.active).toBe(true)
    })

    it('should get autofilled from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })

      expect(props1.autofilled).toBe(false)

      const props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            autofilled: true
          }
        }
      })

      expect(props2.autofilled).toBe(true)
    })

    it('should get touched from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })

      expect(props1.touched).toBe(false)

      const props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            touched: true
          }
        }
      })

      expect(props2.touched).toBe(true)
    })

    it('should get visited from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })

      expect(props1.visited).toBe(false)

      const props2 = testProps({
        values: {
          foo: 'bar'
        },
        fields: {
          foo: {
            visited: true
          }
        }
      })

      expect(props2.visited).toBe(true)
    })

    it('should pass in the form name as meta.form', () => {
      const props = testProps()
      expect(props.form).toBe(testFormName)
    })

    it('should get sync errors from outer reduxForm component', () => {
      const props = testProps(
        {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          },
          registeredFields: {
            foo: { name: 'foo', type: 'Field' }
          }
        },
        {
          validate: () => ({ foo: 'foo error' })
        }
      )

      expect(props.error).toBe('foo error')
    })

    it('should get sync warnings from outer reduxForm component', () => {
      const props = testProps(
        {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          },
          registeredFields: {
            foo: { name: 'foo', type: 'Field' }
          }
        },
        {
          warn: () => ({ foo: 'foo warning' })
        }
      )

      expect(props.warning).toBe('foo warning')
    })

    it('should get async errors from Redux state', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        asyncErrors: {
          foo: 'foo error'
        }
      })

      expect(props.error).toBe('foo error')
    })

    it('should get submit errors from Redux state', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        submitErrors: {
          foo: 'foo error'
        }
      })

      expect(props.error).toBe('foo error')
    })

    it('should get submitFailed prop from Redux state', () => {
      const props = testProps({
        submitFailed: true
      })
      expect(props.submitFailed).toBe(true)
    })

    it('should have value set to initial value on first render', () => {
      const store = makeStore({})
      const input = jest.fn(props => <input {...props.input} />)
      class Form extends Component {
        render() {
          return (
            <div>
              <QueryField name="foo" render={input} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm initialValues={{ foo: 'bar' }} />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.mock.calls[0][0].value).toBe('bar')
    })

    it('should provide sync error for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const validate = () => ({ foo: ['bar error'] })
      class Form extends Component {
        render() {
          return (
            <div>
              <QueryField name="foo[0]" render={input} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        validate
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].valid).toBe(false)
      expect(input.mock.calls[0][0].error).toBe('bar error')
    })

    it('should provide sync warning for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const warn = () => ({ foo: ['bar warning'] })
      class Form extends Component {
        render() {
          return (
            <div>
              <QueryField name="foo[0]" render={input} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].warning).toBe('bar warning')
    })

    it('should reconnect when name changes', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          },
          fields: {
            bar: {
              touched: true
            }
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      class Form extends Component {
        constructor() {
          super()
          this.state = { field: 'foo' }
        }

        render() {
          return (
            <div>
              <QueryField name={this.state.field} render={input} />
              <button onClick={() => this.setState({ field: 'bar' })}>
                Change
              </button>
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input).toHaveBeenCalledTimes(1)
      expect(input.mock.calls[0][0].value).toBe('fooValue')
      expect(input.mock.calls[0][0].touched).toBe(false)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input).toHaveBeenCalledTimes(2)
      expect(input.mock.calls[1][0].value).toBe('barValue')
      expect(input.mock.calls[1][0].touched).toBe(true)
    })

    it('should prefix name getter when inside FormSection', () => {
      const input = jest.fn(props => <input {...props} />)
      const store = makeStore()
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo" component="span">
              <QueryField name="bar" render={input} />
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(input.mock.calls[0][0].name).toBe('foo.bar')
    })

    it('should render new value when Field change', () => {
      const store = makeStore()
      const renderValue = jest.fn(props => <span>{props.value}</span>)
      class Form extends Component {
        render() {
          return (
            <div>
              <Field name="foo" component="input" />
              <QueryField name="foo" render={renderValue} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )
      expect(renderValue).toHaveBeenCalled()
      expect(renderValue).toHaveBeenCalledTimes(1)
      expect(renderValue.mock.calls[0][0].value).toBe('')

      const input = TestUtils.findRenderedDOMComponentWithTag(dom, 'input')
      input.value = 'bar'

      TestUtils.Simulate.change(input)

      expect(renderValue).toHaveBeenCalledTimes(2)
      expect(renderValue.mock.calls[1][0].value).toBe('bar')
    })

    it('should call format function on first render', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'Redux Form'
          }
        }
      })
      const input = jest.fn(props => <span>{props.value}</span>)
      const format = jest.fn(value => value.toLowerCase())
      class Form extends Component {
        render() {
          return (
            <div>
              <QueryField name="name" render={input} format={format} />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(format).toHaveBeenCalled()
      expect(format).toHaveBeenCalledTimes(1)
      expect(format.mock.calls[0]).toEqual(['Redux Form', 'name'])

      expect(input.mock.calls[0][0].value).toBe('redux form')
    })

    it('should not register Field using QueryField', () => {
      const store = makeStore({
        testForm: {}
      })
      const input = props => <span>{props.value}</span>
      class Form extends Component {
        render() {
          return <QueryField name="name" render={input} />
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm />
        </Provider>
      )

      expect(store.getState().registeredFields).toBeUndefined()
    })
  })
}

describeQueryField('QueryField.plain', plain, plainCombineReducers, () =>
  expect.extend(plainExpectations)
)

describeQueryField(
  'QueryField.immutable',
  immutable,
  immutableCombineReducers,
  () => expect.extend(immutableExpectations)
)
