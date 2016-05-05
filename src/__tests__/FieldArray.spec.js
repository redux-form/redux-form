/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { createSpy } from 'expect'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-addons-test-utils'
import createReduxForm from '../reduxForm'
import createReducer from '../reducer'
import createFieldArray from '../FieldArray'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeFieldArray = (name, structure, combineReducers, expect) => {
  const reduxForm = createReduxForm(structure)
  const FieldArray = createFieldArray(structure)
  const reducer = createReducer(structure)
  const { fromJS, getIn, size } = structure
  const makeStore = (initial = {}) => createStore(
    combineReducers({ form: reducer }), fromJS({ form: initial }))

  class TestComponent extends Component {
    render() {
      return <div>TEST INPUT</div>
    }
  }


  const testProps = (state, config = {}) => {
    const store = makeStore({ testForm: state })
    class Form extends Component {
      render() {
        return <div><FieldArray name="foo" component={TestComponent}/></div>
      }
    }
    const TestForm = reduxForm({ form: 'testForm', ...config })(Form)
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <TestForm/>
      </Provider>
    )
    return TestUtils.findRenderedComponentWithType(dom, TestComponent).props
  }

  describe(name, () => {
    it('should throw an error if not in ReduxForm', () => {
      expect(() => {
        TestUtils.renderIntoDocument(<div>
            <FieldArray name="foo" component={TestComponent}/>
          </div>
        )
      }).toThrow(/must be inside a component decorated with reduxForm/)
    })

    it('should get length from Redux state', () => {
      const props = testProps({
        values: {
          foo: [ 'a', 'b', 'c' ]
        }
      })
      expect(props.length).toBe(3)
    })

    it('should be okay with no array value', () => {
      const iterate = createSpy()
      const props = testProps({
        values: {}
      })
      expect(props.length).toBe(0)
      props.forEach(iterate)
      props.map(iterate)
      expect(iterate).toNotHaveBeenCalled()
    })

    it('should get dirty/pristine from Redux state', () => {
      const props1 = testProps({
        initial: {
          foo: [ 'a', 'b', 'c' ]
        },
        values: {
          foo: [ 'a', 'b', 'c' ]
        }
      })
      expect(props1.pristine).toBe(true)
      expect(props1.dirty).toBe(false)
      const props2 = testProps({
        initial: {
          foo: [ 'a', 'b', 'c' ]
        },
        values: {
          foo: [ 'a', 'b' ]
        }
      })
      expect(props2.pristine).toBe(false)
      expect(props2.dirty).toBe(true)
    })

    it('should use initialValues', () => {
      const props = testProps({}, {
        initialValues: {
          foo: [ 'a', 'b', 'c' ]
        }
      })
      expect(props.length).toBe(3)
      const iterate = createSpy()
      props.forEach(iterate)
      expect(iterate).toHaveBeenCalled()
      expect(iterate.calls.length).toBe(3)
      expect(iterate.calls[ 0 ].arguments[ 0 ]).toBe('foo[0]')
      expect(iterate.calls[ 1 ].arguments[ 0 ]).toBe('foo[1]')
      expect(iterate.calls[ 2 ].arguments[ 0 ]).toBe('foo[2]')
    })

    it('should get sync errors from outer reduxForm component', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      }, {
        validate: () => ({ foo: { _error: 'foo error' } })
      })
      expect(props.error).toBe('foo error')
    })

    it('should get async errors from Redux state', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        },
        asyncErrors: {
          foo: {
            _error: 'foo error'
          }
        }
      })
      expect(props.error).toBe('foo error')
    })

    it('should get submit errors from Redux state', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        },
        submitErrors: {
          foo: {
            _error: 'foo error'
          }
        }
      })
      expect(props.error).toBe('foo error')
    })

    it('should provide valid getter', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          },
          submitErrors: {
            foo: {
              _error: 'foo error'
            }
          }
        }
      })
      class Form extends Component {
        render() {
          return <div><FieldArray name="foo" component={TestComponent}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, FieldArray)
      expect(stub.valid).toBe(false)
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
          return <div><FieldArray name="foo" component={TestComponent}/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const stub = TestUtils.findRenderedComponentWithType(dom, FieldArray)
      expect(stub.name).toBe('foo')
    })

    it('should reconnect when name changes', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'a', 'b' ],
            bar: [ 'c' ]
          }
        }
      })
      const input = createSpy(() => <div/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { field: 'foo' }
        }

        render() {
          return (<div>
            <FieldArray name={this.state.field} component={input}/>
            <button onClick={() => this.setState({ field: 'bar' })}>Change</button>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(input).toHaveBeenCalled()
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].length).toBe(2)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].length).toBe(1)
    })

    it('should rerender when array sync error appears', () => {
      const store = makeStore({ testForm: {} })
      const renderFieldArray =
        createSpy(dogs => (<div>
          {dogs.map((dog, index) => <input key={index} {...dog}/>)}
          <button onClick={() => dogs.push()}>Add Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        validate: values => {
          const dogs = getIn(values, 'dogs')
          const errors = {
            dogs: dogs ? dogs.map(dog => !dog || !dog.length ? 'Required' : undefined) : []
          }
          if (dogs && size(dogs) > 2) {
            errors.dogs._error = 'Too many'
          }
          return errors
        }
      })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const addButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')

      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].length).toBe(0)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].error).toNotExist()

      TestUtils.Simulate.click(addButton) // length goes to 1, no error yet

      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].length).toBe(1)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].error).toNotExist()

      TestUtils.Simulate.click(addButton) // length goes to 2, no error yet

      expect(renderFieldArray.calls.length).toBe(3)
      expect(renderFieldArray.calls[ 2 ].arguments[ 0 ].length).toBe(2)
      expect(renderFieldArray.calls[ 2 ].arguments[ 0 ].error).toNotExist()

      TestUtils.Simulate.click(addButton) // length goes to 3, ERROR!

      expect(renderFieldArray.calls.length).toBe(4)
      expect(renderFieldArray.calls[ 3 ].arguments[ 0 ].length).toBe(3)
      expect(renderFieldArray.calls[ 3 ].arguments[ 0 ].error)
        .toExist()
        .toBe('Too many')
    })
  })
}

describeFieldArray('FieldArray.plain', plain, plainCombineReducers, addExpectations(plainExpectations))
describeFieldArray('FieldArray.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations))
