import expect from 'expect'
import { Map, List } from 'immutable'
import getFormValue from '../getFormValue'

describe('getFormValue', () => {
  it('should throw if any argument is missing', () => {
    const formState = {
      myForm: {
        values: {
          fieldName: 'value'
        }
      }
    }
    const formName = 'myForm'
    const field = 'fieldName'

    expect(() => {
      getFormValue()
    }).toThrow()
    expect(() => {
      getFormValue({})
    }).toThrow(/Missing argument/)
    expect(() => {
      getFormValue({ formState, formName })
    }).toThrow(/Missing argument/)
    expect(() => {
      getFormValue({ formState, field })
    }).toThrow(/Missing argument/)
    expect(() => {
      getFormValue({ formName, field })
    }).toThrow(/Missing argument/)
  })

  it('should return undefined for invalid formName', () => {
    const formState = {}
    const formName = 'myForm'
    const field = 'fieldName'
    expect(getFormValue({ formState, formName, field })).toBeAn('undefined')
  })

  it('should return undefined if the values property does not exist in the formState', () => {
    const formState = { myForm: {} }
    const formName = 'myForm'
    const field = 'fieldName'
    expect(getFormValue({ formState, formName, field })).toBeAn('undefined')
  })

  it('should return undefined for invalid field', () => {
    const formState = {
      myForm: {
        values: {
          fieldName: 'value'
        }
      }
    }
    const immutableFormState = Map({
      myForm: Map({
        values: Map({
          fieldName: 'value'
        })
      })
    })
    const formName = 'myForm'
    const field = 'wrongKey'
    expect(getFormValue({ formState, formName, field })).toBeAn('undefined')
    expect(getFormValue({ formState: immutableFormState, formName, field })).toBeAn('undefined')

  })

  it('should return value', () => {
    const formState = {
      myForm: {
        values: {
          fieldName: 'value'
        }
      }
    }
    const immutableFormState = Map({
      myForm: Map({
        values: Map({
          fieldName: 'value'
        })
      })
    })
    const formName = 'myForm'
    const field = 'fieldName'
    expect(getFormValue({ formState, formName, field })).toEqual('value')
    expect(getFormValue({ formState: immutableFormState, formName, field })).toEqual('value')
  })

  it('should return value for deeply nested field inside object and array', () => {
    const formState = {
      myForm: {
        values: {
          fieldName: {
            nestedField: [ 'wrong', 'expectedValue' ]
          }
        }
      }
    }
    const immutableFormState = Map({
      myForm: Map({
        values: Map({
          fieldName: Map({
            nestedField: List.of('wrong', 'expectedValue')
          })
        })
      })
    })
    const formName = 'myForm'
    const field = 'fieldName.nestedField[1]'
    expect(getFormValue({ formState, formName, field })).toEqual('expectedValue')
    expect(getFormValue({ formState: immutableFormState, formName, field })).toEqual('expectedValue')
  })
})
