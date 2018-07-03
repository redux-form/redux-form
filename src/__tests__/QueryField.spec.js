/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import TestUtils from 'react-dom/test-utils'
import createReduxForm from '../createReduxForm'
import createReducer from '../createReducer'
import createField from '../createField'
import createQueryField from '../createQueryField'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/__tests__/expectations'

import { dragStartMock, dropMock } from '../util/eventMocks'
import { dataKey } from '../util/eventConsts'

const testFormName = 'testForm'

const reduxForm = createReduxForm(plain)
const Field = createField(plain)
const QueryField = createQueryField(plain)
const reducer = createReducer(plain)
const { fromJS, getIn } = plain
const makeStore = initial =>
  createStore(combineReducers({ form: reducer }), fromJS({ form: initial }))

class TestInput extends Component {
  render() {
    return <div>TEST INPUT</div>
  }
}

describe('QueryField', () => {
  beforeAll(() => {
    expect.extend(plainExpectations)
  })

  it('should throw an error if not in ReduxForm', () => {
    expect(() => {
      TestUtils.renderIntoDocument(
        <div>
          <QueryField name="foo">{data => <TestInput {...data} />}</QueryField>
        </div>
      )
    }).toThrow(/must be inside a component decorated with reduxForm/)
  })

  it('should provide name getter', () => {
    const store = makeStore({
      testForm: {
        values: {
          foo: 'bar'
        }
      }
    })
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
    const TestForm = reduxForm({ form: 'testForm' })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    const stub = TestUtils.findRenderedComponentWithType(dom, TestInput)
    expect(stub.props.name).toBe('foo')
  })

  it('should provide value getter', () => {
    const store = makeStore({
      testForm: {
        values: {
          foo: 'bar'
        }
      }
    })
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
    const TestForm = reduxForm({ form: 'testForm' })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    const stub = TestUtils.findRenderedComponentWithType(dom, TestInput)
    expect(stub.props.value).toBe('bar')
  })

  it('should provide dirty getter that is true when dirty', () => {
    const store = makeStore({
      testForm: {
        values: {
          foo: 'bar'
        }
      }
    })
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
    const TestForm = reduxForm({ form: 'testForm' })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    const stub = TestUtils.findRenderedComponentWithType(dom, TestInput)
    expect(stub.props.dirty).toBe(true)
  })

  it('should provide dirty getter that is false when pristine', () => {
    const store = makeStore({
      testForm: {
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }
    })
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
    const TestForm = reduxForm({ form: 'testForm' })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    const stub = TestUtils.findRenderedComponentWithType(dom, TestInput)
    expect(stub.props.dirty).toBe(false)
  })

  it('should provide pristine getter that is false when dirty', () => {
    const store = makeStore({
      testForm: {
        values: {
          foo: 'bar'
        }
      }
    })
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
    const TestForm = reduxForm({ form: 'testForm' })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    const stub = TestUtils.findRenderedComponentWithType(dom, TestInput)
    expect(stub.props.pristine).toBe(false)
  })

  it('should provide pristine getter that is true when pristine', () => {
    const store = makeStore({
      testForm: {
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }
    })
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
    const TestForm = reduxForm({ form: 'testForm' })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    const stub = TestUtils.findRenderedComponentWithType(dom, TestInput)
    expect(stub.props.pristine).toBe(true)
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
    const validate = () => ({ foo: 'bar error' })
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
    expect(input.mock.calls[0][0].syncError).toBe('bar error')
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
      state = { field: 'foo' }

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

    const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
    TestUtils.Simulate.click(button)

    expect(input).toHaveBeenCalledTimes(2)
    expect(input.mock.calls[1][0].value).toBe('barValue')
  })

  it('should prefix name getter when inside FormSection', () => {
    const store = makeStore()
    class Form extends Component {
      render() {
        return (
          <FormSection name="foo" component="span">
            <QueryField name="bar">
              {data => <TestInput {...data} />}
            </QueryField>
          </FormSection>
        )
      }
    }
    const TestForm = reduxForm({ form: 'testForm' })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    const stub = TestUtils.findRenderedComponentWithType(dom, TestInput)

    expect(stub.props.name).toBe('foo.bar')
  })
  it('should prefix name getter when inside multiple FormSection', () => {
    const store = makeStore()
    class Form extends Component {
      render() {
        return (
          <FormSection name="foo">
            <FormSection name="fighter">
              <QueryField name="bar">
                {data => <TestInput {...data} />}
              </QueryField>
            </FormSection>
          </FormSection>
        )
      }
    }
    const TestForm = reduxForm({ form: 'testForm' })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm />
      </Provider>
    )
    const stub = TestUtils.findRenderedComponentWithType(dom, TestInput)
    expect(stub.props.name).toBe('foo.fighter.bar')
  })
})
