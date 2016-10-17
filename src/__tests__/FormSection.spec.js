/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react'
import { createSpy } from 'expect'
import { Provider } from 'react-redux'
import { combineReducers as plainCombineReducers, createStore } from 'redux'
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs'
import TestUtils from 'react-addons-test-utils'
import createReduxForm from '../reduxForm'
import createReducer from '../reducer'
import createField from '../Field'
import createFieldArray from '../FieldArray'
import FormSection from '../FormSection'
import plain from '../structure/plain'
import plainExpectations from '../structure/plain/expectations'
import immutable from '../structure/immutable'
import immutableExpectations from '../structure/immutable/expectations'
import addExpectations from './addExpectations'

const describeFormSection = (name, structure, combineReducers, expect) => {
  const reduxForm = createReduxForm(structure)
  const Field = createField(structure)
  const FieldArray = createFieldArray(structure)
  const reducer = createReducer(structure)
  const { fromJS } = structure
  const makeStore = (initial) => createStore(
    combineReducers({ form: reducer }), fromJS({ form: initial }))

  describe(name, () => {
    it('should throw an error if not in ReduxForm', () => {
      expect(() => {
        TestUtils.renderIntoDocument(<div>
            <FormSection name="foo"/>
          </div>
        )
      }).toThrow(/must be inside a component decorated with reduxForm/)
    })

    it('should update Field values at the right depth', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: '42'
            }
          }
        }
      })
      const input = createSpy(props => <input {...props.input}/>).andCallThrough()
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <Field name="bar" component={input}/>
            </FormSection>
          )
        }
      }
      const TestForm = reduxForm({ form: 'testForm' })(Form)
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <TestForm/>
        </Provider>
      )

      // input displaying string value
      expect(input.calls.length).toBe(1)
      expect(input.calls[ 0 ].arguments[ 0 ].input.value).toBe('42')

      // update value
      input.calls[ 0 ].arguments[ 0 ].input.onChange('15')

      // input displaying updated string value
      expect(input.calls.length).toBe(2)
      expect(input.calls[ 1 ].arguments[ 0 ].input.value).toBe('15')

      
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: '15' 
              }
            },
            registeredFields: [ { name: 'foo.bar', type: 'Field' } ]
          }
        }
      })
    })


    it('should update FieldArray values at the right depth', () => {
      const store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: [ 'dog', 'cat' ]
            }
          }
        }
      })

      const renderField = createSpy(props => <input {...props.input}/>).andCallThrough()
      const renderFieldArray =
        createSpy(({ fields }) => (<div>
          {fields.map(field => <Field name={field} component={renderField} key={field}/>)}
          <button className="add" onClick={() => fields.push('fish')}>Add Dog</button>
          <button className="remove" onClick={() => fields.pop()}>Remove Dog</button>
        </div>)).andCallThrough()
        
      class Form extends Component {
        render() {
          return (
            <FormSection name="foo">
              <FieldArray name="bar" component={renderFieldArray}/>
            </FormSection>
          )
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
      TestUtils.Simulate.click(addButton)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: [ 'dog', 'cat', 'fish' ]
              }
            },
            registeredFields: [ 
              { name: 'foo.bar', type: 'FieldArray' },
              { name: 'foo.bar[0]', type: 'Field' },
              { name: 'foo.bar[1]', type: 'Field' },
              { name: 'foo.bar[2]', type: 'Field' }
            ]
          }
        }
      })

      TestUtils.Simulate.click(removeButton)

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: [ 'dog', 'cat' ]
              }
            },
            registeredFields: [ 
              { name: 'foo.bar', type: 'FieldArray' },
              { name: 'foo.bar[0]', type: 'Field' },
              { name: 'foo.bar[1]', type: 'Field' } 
            ]
          }
        }
      })
    })
  })
}

describeFormSection('FormSection.plain', plain, plainCombineReducers, addExpectations(plainExpectations))
describeFormSection('FormSection.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations))
