/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-dom/test-utils'
import createReduxForm from '../createReduxForm'
import createReducer from '../createReducer'
import createFields from '../createFields'
import createQueryFields from '../createQueryFields'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/__tests__/expectations'

const describeFields = (name, structure, combineReducers, setup) => {
  const reduxForm = createReduxForm(structure)
  const Fields = createFields(structure)
  const QueryFields = createQueryFields(structure)
  const reducer = createReducer(structure)
  const { fromJS, getIn } = structure
  const makeStore = initial =>
    createStore(combineReducers({ form: reducer }), fromJS({ form: initial }))

  class TestInput extends Component {
    render() {
      return <div>TEST INPUT</div>
    }
  }

  const testProps = (state, config = {}) => {
    const store = makeStore({ testForm: state })
    class Form extends Component {
      render() {
        return (
          <div>
            <QueryFields names={['foo']}>
              {data => <TestInput {...data} />}
            </QueryFields>
          </div>
        )
      }
    }
    const TestForm = reduxForm({ form: 'testForm', ...config })(Form)
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
          <QueryFields names={['foo', 'bar']} render={TestInput} />
        )
      }).toThrow(/must be inside a component decorated with reduxForm/)
    })

    it('should throw an error if invalid component prop is provided', () => {
      const store = makeStore()
      const notAComponent = {}
      class Form extends Component {
        render() {
          return <QueryFields names={['foo', 'bar']} render={notAComponent} />
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

    it('should warn if no names prop is provided', () => {
      const spy = jest.spyOn(console, 'error') // mutes prop type warning
      const store = makeStore()
      class Form extends Component {
        render() {
          return <QueryFields render={TestInput} />
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      expect(() => {
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <TestForm />
          </Provider>
        )
      }).toThrow(/No "names" prop was specified/)
    })

    it('should warn if invalid names prop is provided', () => {
      const spy = jest.spyOn(console, 'error') // mutes prop type warning
      const store = makeStore()
      class Form extends Component {
        render() {
          return <QueryFields names="This is a string" component={TestInput} />
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      expect(() => {
        TestUtils.renderIntoDocument(
          <Provider store={store}>
            <TestForm />
          </Provider>
        )
      }).toThrow(/Invalid prop "names"/)
      spy.mockReset()
    })

    it('should get value from Redux state', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props.foo.value).toBe('bar')
    })

    it('should get meta.form', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props.foo.form).toBe('testForm')
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
      expect(props.foo.initial).toBe('bar')
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
      expect(props1.foo.pristine).toBe(true)
      expect(props1.foo.dirty).toBe(false)
      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      })
      expect(props2.foo.pristine).toBe(false)
      expect(props2.foo.dirty).toBe(true)
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
      expect(props1.foo.pristine).toBe(false)
      expect(props1.foo.dirty).toBe(true)
      const props2 = testProps({
        initial: {
          foo: ''
        },
        values: {
          foo: ''
        }
      })
      expect(props2.foo.pristine).toBe(true)
      expect(props2.foo.dirty).toBe(false)
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
      expect(props1.foo.asyncValidating).toBe(false)
      const props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        },
        asyncValidating: 'foo'
      })
      expect(props2.foo.asyncValidating).toBe(true)
    })

    it('should get sync errors from outer reduxForm component', () => {
      const props = testProps(
        {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        },
        {
          validate: () => ({ foo: 'foo error' })
        }
      )
      expect(props.foo.error).toBe('foo error')
    })

    it('should get sync warnings from outer reduxForm component', () => {
      const props = testProps(
        {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        },
        {
          warn: () => ({ foo: 'foo warning' })
        }
      )
      expect(props.foo.warning).toBe('foo warning')
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
      expect(props.foo.error).toBe('foo error')
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
      expect(props.foo.error).toBe('foo error')
    })

    it('should get submitFailed prop from Redux state', () => {
      const props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        submitFailed: true
      })
      expect(props.foo.submitFailed).toBe(true)
    })

    it('should have value set to initial value on first render', () => {
      const store = makeStore({})
      const input = jest.fn(props => <input {...props.foo.input} />)
      class Form extends Component {
        render() {
          return <QueryFields names={['foo', 'bar']} render={input} />
        }
      }
      const TestForm = reduxForm({
        form: 'testForm'
      })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm initialValues={{ foo: 'fooValue', bar: 'barValue' }} />
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.mock.calls[0][0].foo.value).toBe('fooValue')
      expect(input.mock.calls[0][0].bar.value).toBe('barValue')
    })

    it('should prefix name when inside FormSection', () => {
      const store = makeStore({
        form: {
          testForm: {
            registeredFields: {
              'foo.foo': { name: 'foo.foo', type: 'Field', count: 1 },
              'foo.bar': { name: 'foo.bar', type: 'Field', count: 1 }
            }
          }
        }
      })
      const input = jest.fn(props => <input {...props} />)

      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <QueryFields names={['foo', 'bar']} render={input} />
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

      expect(input.mock.calls[0][0]['foo.foo'].value).toBe('')
      expect(input.mock.calls[0][0]['foo.bar'].value).toBe('')
    })

    it('should call format function on first render', () => {
      const store = makeStore({
        testForm: {
          values: {
            name: 'Redux Form'
          }
        }
      })
      const input = jest.fn(props => <input {...props.input} />)
      const format = jest.fn(value => value.toLowerCase())
      class Form extends Component {
        render() {
          return (
            <div>
              <Fields names={['name']} component={input} format={format} />
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

      expect(input.mock.calls[0][0].name.input.value).toBe('redux form')
    })
  })
}

describeFields('QueryFields.plain', plain, plainCombineReducers, () =>
  expect.extend(plainExpectations)
)
describeFields(
  'QueryFields.immutable',
  immutable,
  immutableCombineReducers,
  () => expect.extend(immutableExpectations)
)
