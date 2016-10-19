import expect from 'expect'
import plain from '../structure/plain'
import immutable from '../structure/immutable'
import defaultShouldValidate from '../defaultShouldValidate'

describe('defaultShouldValidate', () => {

  it('should validate when initialRender is true', () => {
    expect(defaultShouldValidate({
      initialRender: true
    })).toBe(true)
  })

  const itValidateChange = (structure) => {
    const { fromJS } = structure

    it('should validate if values have changed', () => {
      expect(defaultShouldValidate({
        initialRender: false,
        structure,
        values: fromJS({
          foo: 'fooInitial'
        }),
        nextProps: {
          values: fromJS({
            foo: 'fooChanged'
          })
        }
      }), true)
    })

    it('should not validate if values have not changed', () => {
      expect(defaultShouldValidate({
        initialRender: false,
        structure,
        values: fromJS({
          foo: 'fooInitial'
        }),
        nextProps: {
          values: fromJS({
            foo: 'fooInitial'
          })
        }
      }), false)
    })
  }

  itValidateChange(plain)
  itValidateChange(immutable)
})
