/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import domExpect, { createSpy } from 'expect'
import expectElement from 'expect-element'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-addons-test-utils'
import createReduxForm from '../reduxForm'
import createReducer from '../reducer'
import createFieldArray from '../FieldArray'
import createField from '../Field'
import createFields from '../Fields'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

domExpect.extend(expectElement)

const describeFieldArray = (name, structure, combineReducers, expect) => {
  const reduxForm = createReduxForm(structure)
  const FieldArray = createFieldArray(structure)
  const Field = createField(structure)
  const Fields = createFields(structure)
  const reducer = createReducer(structure)
  const { fromJS, getIn, size } = structure
  const makeStore = (initial) => createStore(
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
      expect(props.fields.length).toBe(3)
    })

    it('should be okay with no array value', () => {
      const iterate = createSpy()
      const props = testProps({
        values: {}
      })
      expect(props.fields.length).toBe(0)
      props.fields.forEach(iterate)
      props.fields.map(iterate)
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
      expect(props1.meta.pristine).toBe(true)
      expect(props1.meta.dirty).toBe(false)
      const props2 = testProps({
        initial: {
          foo: [ 'a', 'b', 'c' ]
        },
        values: {
          foo: [ 'a', 'b' ]
        }
      })
      expect(props2.meta.pristine).toBe(false)
      expect(props2.meta.dirty).toBe(true)
    })

    it('should get touched from Redux state', () => {
      const props1 = testProps({
        values: {
          foo: 'bar'
        }
      })
      expect(props1.meta.touched).toBe(false)
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
      expect(props2.meta.touched).toBe(true)
    })


    it('should provide forEach', () => {
      const props = testProps({
        values: {
          foo: [ 'a', 'b', 'c' ]
        }
      })
      expect(props.fields.forEach).toBeA('function')
      const iterate = createSpy()
      props.fields.forEach(iterate)
      expect(iterate).toHaveBeenCalled()
      expect(iterate.calls.length).toBe(3)
      expect(iterate.calls[ 0 ].arguments).toEqual([ 'foo[0]', 0, props.fields ])
      expect(iterate.calls[ 1 ].arguments).toEqual([ 'foo[1]', 1, props.fields ])
      expect(iterate.calls[ 2 ].arguments).toEqual([ 'foo[2]', 2, props.fields ])
    })

    it('should provide map', () => {
      const props = testProps({
        values: {
          foo: [ 'a', 'b', 'c' ]
        }
      })
      expect(props.fields.map).toBeA('function')
      const iterate = createSpy()
      props.fields.map(iterate)
      expect(iterate).toHaveBeenCalled()
      expect(iterate.calls.length).toBe(3)
      expect(iterate.calls[ 0 ].arguments).toEqual([ 'foo[0]', 0, props.fields ])
      expect(iterate.calls[ 1 ].arguments).toEqual([ 'foo[1]', 1, props.fields ])
      expect(iterate.calls[ 2 ].arguments).toEqual([ 'foo[2]', 2, props.fields ])
    })

    it('should provide insert', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.insert).toBeA('function')
    })

    it('should provide push', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.push).toBeA('function')
    })

    it('should provide pop', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.pop).toBeA('function')
    })

    it('should provide shift', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.shift).toBeA('function')
    })

    it('should provide unshift', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.unshift).toBeA('function')
    })

    it('should provide move', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.move).toBeA('function')
    })

    it('should provide remove', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.remove).toBeA('function')
    })

    it('should provide removeAll', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.removeAll).toBeA('function')
    })

    it('should provide swap', () => {
      const props = testProps({
        values: {
          foo: []
        }
      })
      expect(props.fields.swap).toBeA('function')
    })

    it('should provide pass through other props', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'bar' ]
          }
        }
      })
      const renderArray = createSpy(() => <div/>).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <div>
              <FieldArray
                name="foo"
                component={renderArray}
                otherProp="dog"
                anotherProp="cat"
              />
            </div>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(renderArray).toHaveBeenCalled()
      expect(renderArray.calls.length).toBe(1)
      expect(renderArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(1)
      expect(renderArray.calls[ 0 ].arguments[ 0 ].otherProp).toBe('dog')
      expect(renderArray.calls[ 0 ].arguments[ 0 ].anotherProp).toBe('cat')
    })

    it('should provide access to rendered component', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'bar' ]
          }
        }
      })
      class TestComponent extends Component {
        render() {
          return <div>TEST INPUT</div>
        }
      }
      class Form extends Component {
        render() {
          return <div><FieldArray name="foo" component={TestComponent} withRef/></div>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const field = TestUtils.findRenderedComponentWithType(dom, FieldArray)
      const component = TestUtils.findRenderedComponentWithType(dom, TestComponent)

      expect(field.getRenderedComponent()).toBe(component)
    })

    it('should use initialValues', () => {
      const props = testProps({}, {
        initialValues: {
          foo: [ 'a', 'b', 'c' ]
        }
      })
      expect(props.fields.length).toBe(3)
      const iterate = createSpy()
      props.fields.forEach(iterate)
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
      expect(props.meta.error).toBe('foo error')
    })

    it('should get sync warnings from outer reduxForm component', () => {
      const props = testProps({
        values: {
          foo: 'bar'
        }
      }, {
        warn: () => ({ foo: { _warning: 'foo warning' } })
      })
      expect(props.meta.warning).toBe('foo warning')
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
      expect(props.meta.error).toBe('foo error')
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
      expect(props.meta.error).toBe('foo error')
    })

    it('should provide name getter', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'bar' ]
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
      expect(stub.name).toEqual('foo')
    })

    it('should provide value getter', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'bar' ]
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
      expect(stub.value).toEqualMap([ 'bar' ])
    })

    it('should provide dirty getter that is true when dirty', () => {
      const store = makeStore({
        testForm: {
          initial: {
            foo: [ 'dog' ]
          },
          values: {
            foo: [ 'cat' ]
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
      expect(stub.dirty).toBe(true)
    })

    it('should provide dirty getter that is false when pristine', () => {
      const store = makeStore({
        testForm: {
          initial: {
            foo: [ 'dog' ]
          },
          values: {
            foo: [ 'dog' ]
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
      expect(stub.dirty).toBe(false)
    })

    it('should provide pristine getter that is true when pristine', () => {
      const store = makeStore({
        testForm: {
          initial: {
            foo: [ 'dog' ]
          },
          values: {
            foo: [ 'dog' ]
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
      expect(stub.pristine).toBe(true)
    })

    it('should provide pristine getter that is false when dirty', () => {
      const store = makeStore({
        testForm: {
          initial: {
            foo: [ 'dog' ]
          },
          values: {
            foo: [ 'cat' ]
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
      expect(stub.pristine).toBe(false)
    })

    it('should provide sync error for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [
              {
                library: 'redux-form',
                author: 'erikras'
              }
            ]
          }
        }
      })
      const validate = () => ({
        foo: [
          {
            _error: 'Too awesome!'
          }
        ]
      })
      const renderArray = ({ fields }) =>
        <div>
          {fields.map((name, index) =>
            <div key={index}>
              <Field name={`${name}.library`} component="input"/>
              <Field name={`${name}.author`} component="input"/>
              <Field name={name} component={props => <strong>{props.meta.error}</strong>}/>
            </div>
          )}
        </div>
      class Form extends Component {
        render() {
          return (
            <div>
              <FieldArray name="foo" component={renderArray}/>
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        validate
      })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const error = TestUtils.findRenderedDOMComponentWithTag(dom, 'strong')
      domExpect(error)
        .toExist()
        .toHaveText('Too awesome!')
    })

    it('should provide sync warning for array field', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [
              {
                library: 'redux-form',
                author: 'erikras'
              }
            ]
          }
        }
      })
      const warn = () => ({
        foo: [
          {
            _warning: 'Too awesome!'
          }
        ]
      })
      const renderArray = ({ fields }) =>
        <div>
          {fields.map((name, index) =>
            <div key={index}>
              <Field name={`${name}.library`} component="input"/>
              <Field name={`${name}.author`} component="input"/>
              <Field name={name} component={props => <strong>{props.meta.warning}</strong>}/>
            </div>
          )}
        </div>
      class Form extends Component {
        render() {
          return (
            <div>
              <FieldArray name="foo" component={renderArray}/>
            </div>
          )
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn
      })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const warning = TestUtils.findRenderedDOMComponentWithTag(dom, 'strong')
      domExpect(warning)
        .toExist()
        .toHaveText('Too awesome!')
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
      const component = createSpy(() => <div/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { field: 'foo' }
        }

        render() {
          return (<div>
            <FieldArray name={this.state.field} component={component}/>
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
      expect(component).toHaveBeenCalled()
      expect(component.calls.length).toBe(1)
      expect(component.calls[ 0 ].arguments[ 0 ].fields.length).toBe(2)

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(component.calls.length).toBe(2)
      expect(component.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)
    })

    it('should reconnect when props change', () => {
      const store = makeStore()
      const component = createSpy(() => <div/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { foo: 'foo', bar: 'bar' }
        }

        render() {
          return (<div>
            <FieldArray name="foo" foo={this.state.foo} bar={this.state.bar} component={component}/>
            <button onClick={() => this.setState({ foo: 'qux', bar: 'baz' })}>Change</button>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(component).toHaveBeenCalled()
      expect(component.calls.length).toBe(1)
      expect(component.calls[ 0 ].arguments[ 0 ].foo).toBe('foo')
      expect(component.calls[ 0 ].arguments[ 0 ].bar).toBe('bar')

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(component.calls.length).toBe(2)
      expect(component.calls[ 1 ].arguments[ 0 ].foo).toBe('qux')
      expect(component.calls[ 1 ].arguments[ 0 ].bar).toBe('baz')
    })

    it('should allow addition after focus', () => {
      const store = makeStore()
      const component = createSpy(() => <div/>).andCallThrough()
      class Form extends Component {
        constructor() {
          super()
          this.state = { foo: 'foo', bar: 'bar' }
        }

        render() {
          return (<div>
            <FieldArray name="foo" foo={this.state.foo} bar={this.state.bar} component={component}/>
            <button onClick={() => this.setState({ foo: 'qux', bar: 'baz' })}>Change</button>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(component).toHaveBeenCalled()
      expect(component.calls.length).toBe(1)
      expect(component.calls[ 0 ].arguments[ 0 ].foo).toBe('foo')
      expect(component.calls[ 0 ].arguments[ 0 ].bar).toBe('bar')

      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')
      TestUtils.Simulate.click(button)

      expect(component.calls.length).toBe(2)
      expect(component.calls[ 1 ].arguments[ 0 ].foo).toBe('qux')
      expect(component.calls[ 1 ].arguments[ 0 ].bar).toBe('baz')
    })

    it('should rerender when items added or removed', () => {
      const store = makeStore({})
      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
          <button className="add" onClick={() => fields.push()}>Add Dog</button>
          <button className="remove" onClick={() => fields.pop()}>Remove Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const addButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'add')
      const removeButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'remove')

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)

      // add field
      TestUtils.Simulate.click(addButton)

      // field array rerendered, length is 1
      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)

      // add field
      TestUtils.Simulate.click(addButton)

      // field array rerendered, length is 2
      expect(renderFieldArray.calls.length).toBe(3)
      expect(renderFieldArray.calls[ 2 ].arguments[ 0 ].fields.length).toBe(2)

      // add field
      TestUtils.Simulate.click(addButton)

      // field array rerendered, length is 3
      expect(renderFieldArray.calls.length).toBe(4)
      expect(renderFieldArray.calls[ 3 ].arguments[ 0 ].fields.length).toBe(3)

      // remove field
      TestUtils.Simulate.click(removeButton)

      // field array rerendered, length is 2
      expect(renderFieldArray.calls.length).toBe(5)
      expect(renderFieldArray.calls[ 4 ].arguments[ 0 ].fields.length).toBe(2)

      // add field
      TestUtils.Simulate.click(addButton)

      // field array rerendered, length is 3
      expect(renderFieldArray.calls.length).toBe(6)
      expect(renderFieldArray.calls[ 5 ].arguments[ 0 ].fields.length).toBe(3)
    })

    it('should rerender when array sync error appears or disappears', () => {
      const store = makeStore({
        testForm: {
          values: {
            dogs: []
          }
        }
      })
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map((field, index) => <div key={index}>{field}</div>)}
          <button className="add" onClick={() => fields.push()}>Add Dog</button>
          <button className="remove" onClick={() => fields.pop()}>Remove Dog</button>
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
            dogs: []
          }
          if (dogs && size(dogs) === 0) {
            errors.dogs._error = 'No dogs'
          }
          if (dogs && size(dogs) > 1) {
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
      const addButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'add')
      const removeButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'remove')

      // length is 0, ERROR!
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].meta.error)
        .toExist()
        .toBe('No dogs')

      TestUtils.Simulate.click(addButton) // length goes to 1, no error yet

      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].meta.error).toNotExist()

      TestUtils.Simulate.click(addButton) // length goes to 2, ERROR!

      expect(renderFieldArray.calls.length).toBe(3)
      expect(renderFieldArray.calls[ 2 ].arguments[ 0 ].fields.length).toBe(2)
      expect(renderFieldArray.calls[ 2 ].arguments[ 0 ].meta.error)
        .toExist()
        .toBe('Too many')

      TestUtils.Simulate.click(removeButton) // length goes to 1, ERROR disappears!

      expect(renderFieldArray.calls.length).toBe(4)
      expect(renderFieldArray.calls[ 3 ].arguments[ 0 ].fields.length).toBe(1)
      expect(renderFieldArray.calls[ 3 ].arguments[ 0 ].meta.error).toNotExist()

      TestUtils.Simulate.click(removeButton) // length goes to 0, ERROR!

      expect(renderFieldArray.calls.length).toBe(5)
      expect(renderFieldArray.calls[ 4 ].arguments[ 0 ].fields.length).toBe(0)
      expect(renderFieldArray.calls[ 4 ].arguments[ 0 ].meta.error)
        .toExist()
        .toBe('No dogs')
    })

    it('should rerender when array sync warning appears or disappears', () => {
      const store = makeStore({
        testForm: {
          values: {
            dogs: []
          }
        }
      })
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map((field, index) => <div key={index}>{field}</div>)}
          <button className="add" onClick={() => fields.push()}>Add Dog</button>
          <button className="remove" onClick={() => fields.pop()}>Remove Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({
        form: 'testForm',
        warn: values => {
          const dogs = getIn(values, 'dogs')
          const warnings = {
            dogs: []
          }
          if (dogs && size(dogs) === 0) {
            warnings.dogs._warning = 'No dogs'
          }
          if (dogs && size(dogs) > 1) {
            warnings.dogs._warning = 'Too many'
          }
          return warnings
        }
      })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const addButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'add')
      const removeButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'remove')

      // length is 0, ERROR!
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].meta.warning)
        .toExist()
        .toBe('No dogs')

      TestUtils.Simulate.click(addButton) // length goes to 1, no warning yet

      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].meta.warning).toNotExist()

      TestUtils.Simulate.click(addButton) // length goes to 2, ERROR!

      expect(renderFieldArray.calls.length).toBe(3)
      expect(renderFieldArray.calls[ 2 ].arguments[ 0 ].fields.length).toBe(2)
      expect(renderFieldArray.calls[ 2 ].arguments[ 0 ].meta.warning)
        .toExist()
        .toBe('Too many')

      TestUtils.Simulate.click(removeButton) // length goes to 1, ERROR disappears!

      expect(renderFieldArray.calls.length).toBe(4)
      expect(renderFieldArray.calls[ 3 ].arguments[ 0 ].fields.length).toBe(1)
      expect(renderFieldArray.calls[ 3 ].arguments[ 0 ].meta.warning).toNotExist()

      TestUtils.Simulate.click(removeButton) // length goes to 0, ERROR!

      expect(renderFieldArray.calls.length).toBe(5)
      expect(renderFieldArray.calls[ 4 ].arguments[ 0 ].fields.length).toBe(0)
      expect(renderFieldArray.calls[ 4 ].arguments[ 0 ].meta.warning)
        .toExist()
        .toBe('No dogs')
    })

    it('should NOT rerender when a value changes', () => {
      const store = makeStore({
        testForm: {
          values: {
            dogs: [ 'Fido', 'Snoopy' ]
          }
        }
      })
      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      // field array rendered
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)

      // both fields rendered
      expect(renderField).toHaveBeenCalled()
      expect(renderField.calls.length).toBe(2)
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.value).toBe('Fido')

      // change first field
      renderField.calls[ 0 ].arguments[ 0 ].input.onChange('Odie')

      // first field rerendered, second field is NOT
      expect(renderField.calls.length).toBe(3)
      expect(renderField.calls[ 2 ].arguments[ 0 ].input.name).toBe('dogs[0]')
      expect(renderField.calls[ 2 ].arguments[ 0 ].input.value).toBe('Odie')

      // field array NOT rerendered
      expect(renderFieldArray.calls.length).toBe(1)
    })

    it('should create a list in the store on push(undefined)', () => {
      const store = makeStore({})
      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
          <button onClick={() => fields.push()}>Add Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' }
            ]
          }
        }
      })

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)

      // add field
      TestUtils.Simulate.click(button)

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)

      // field rendered
      expect(renderField).toHaveBeenCalled()
      expect(renderField.calls.length).toBe(1)
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.name).toBe('dogs[0]')
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.value).toBe('')

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [ undefined ]
            },
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' },
              { name: 'dogs[0]', type: 'Field' }
            ]
          }
        }
      })

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList()
    })

    it('should create a list in the store on push(value)', () => {
      const store = makeStore({})
      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
          <button onClick={() => fields.push('Fido')}>Add Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' }
            ]
          }
        }
      })

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)

      // add field
      TestUtils.Simulate.click(button)

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)

      // field rendered
      expect(renderField).toHaveBeenCalled()
      expect(renderField.calls.length).toBe(1)
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.name).toBe('dogs[0]')
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.value).toBe('Fido')

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [ 'Fido' ]
            },
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' },
              { name: 'dogs[0]', type: 'Field' }
            ]
          }
        }
      })

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList()
    })

    it('should create a list in the store on unshift(undefined)', () => {
      const store = makeStore({})
      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
          <button onClick={() => fields.unshift()}>Add Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' }
            ]
          }
        }
      })

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)

      // add field
      TestUtils.Simulate.click(button)

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)

      // field rendered
      expect(renderField).toHaveBeenCalled()
      expect(renderField.calls.length).toBe(1)
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.name).toBe('dogs[0]')
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.value).toBe('')

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [ undefined ]
            },
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' },
              { name: 'dogs[0]', type: 'Field' }
            ]
          }
        }
      })

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList()
    })

    it('should create a list in the store on unshift(value)', () => {
      const store = makeStore({})
      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
          <button onClick={() => fields.unshift('Fido')}>Add Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' }
            ]
          }
        }
      })

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)

      // add field
      TestUtils.Simulate.click(button)

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)

      // field rendered
      expect(renderField).toHaveBeenCalled()
      expect(renderField.calls.length).toBe(1)
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.name).toBe('dogs[0]')
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.value).toBe('Fido')

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [ 'Fido' ]
            },
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' },
              { name: 'dogs[0]', type: 'Field' }
            ]
          }
        }
      })

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList()
    })


    it('should create a list in the store on insert(undefined)', () => {
      const store = makeStore({})
      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
          <button onClick={() => fields.insert(0)}>Add Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' }
            ]
          }
        }
      })

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)

      // add field
      TestUtils.Simulate.click(button)

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)

      // field rendered
      expect(renderField).toHaveBeenCalled()
      expect(renderField.calls.length).toBe(1)
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.name).toBe('dogs[0]')
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.value).toBe('')

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [ undefined ]
            },
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' },
              { name: 'dogs[0]', type: 'Field' }
            ]
          }
        }
      })

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList()
    })

    it('should create a list in the store on insert(value)', () => {
      const store = makeStore({})
      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
          <button onClick={() => fields.insert(0, 'Fido')}>Add Dog</button>
        </div>)).andCallThrough()
      class Form extends Component {
        render() {
          return <FieldArray name="dogs" component={renderFieldArray}/>
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      const dom = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      const button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button')

      // only registered field array in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' }
            ]
          }
        }
      })

      // length is 0
      expect(renderFieldArray).toHaveBeenCalled()
      expect(renderFieldArray.calls.length).toBe(1)
      expect(renderFieldArray.calls[ 0 ].arguments[ 0 ].fields.length).toBe(0)

      // add field
      TestUtils.Simulate.click(button)

      // field array rerendered
      expect(renderFieldArray.calls.length).toBe(2)
      expect(renderFieldArray.calls[ 1 ].arguments[ 0 ].fields.length).toBe(1)

      // field rendered
      expect(renderField).toHaveBeenCalled()
      expect(renderField.calls.length).toBe(1)
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.name).toBe('dogs[0]')
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.value).toBe('Fido')

      // field registered in store
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              dogs: [ 'Fido' ]
            },
            registeredFields: [
              { name: 'dogs', type: 'FieldArray' },
              { name: 'dogs[0]', type: 'Field' }
            ]
          }
        }
      })

      // values list is a list
      expect(getIn(store.getState(), 'form.testForm.values.dogs')).toBeAList()
    })

    it('should work with Fields', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: [ 'firstValue', 'secondValue' ]
          }
        }
      })
      const renderField = createSpy(field => <input {...field.input}/>)

      const renderFields = createSpy(({ foo }) =>
        <div>{foo.map(renderField)}</div>).andCallThrough()

      const component = createSpy(({ fields }) => <div>
        <Fields names={fields} component={renderFields}/>
      </div>).andCallThrough()

      class Form extends Component {
        render() {
          return (<div>
            <FieldArray name="foo" component={component}/>
          </div>)
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )
      expect(renderFields).toHaveBeenCalled()
      expect(renderFields.calls.length).toBe(1)
      expect(renderFields.calls[ 0 ].arguments[ 0 ].foo.length).toBe(2)

      expect(renderField).toHaveBeenCalled()
      expect(renderField.calls.length).toBe(2)
      expect(renderField.calls[ 0 ].arguments[ 0 ].input.value).toBe('firstValue')
      expect(renderField.calls[ 1 ].arguments[ 0 ].input.value).toBe('secondValue')
    })
  })
}

describeFieldArray('FieldArray.plain', plain, plainCombineReducers, addExpectations(plainExpectations))
describeFieldArray('FieldArray.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations))
