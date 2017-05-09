import expect from 'expect'
import plain from '../structure/plain'
import immutable from '../structure/immutable'
import defaultShouldValidate from '../defaultShouldValidate'

describe('defaultShouldValidate', () => {
  it('should validate when initialRender is true', () => {
    expect(
      defaultShouldValidate({
        initialRender: true
      })
    ).toBe(true)
  })

  const describeDefaultShouldValidate = structure => {
    const {fromJS} = structure

    it('should validate if values have changed', () => {
      expect(
        defaultShouldValidate({
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
        }),
        true
      )
    })

    it('should not validate if values have not changed', () => {
      expect(
        defaultShouldValidate({
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
        }),
        false
      )
    })
    it('should validate if field validator keys have changed', () => {
      expect(
        defaultShouldValidate({
          initialRender: false,
          structure,
          values: fromJS({
            foo: 'fooValue'
          }),
          nextProps: {
            values: fromJS({
              foo: 'fooValue'
            })
          },
          lastFieldValidatorKeys: [],
          fieldValidatorKeys: ['foo']
        }),
        true
      )
    })

    it('should not validate if field validator keys have not changed', () => {
      expect(
        defaultShouldValidate({
          initialRender: false,
          structure,
          values: fromJS({
            foo: 'fooInitial'
          }),
          nextProps: {
            values: fromJS({
              foo: 'fooInitial'
            })
          },
          lastFieldValidatorKeys: ['foo'],
          fieldValidatorKeys: ['foo']
        }),
        false
      )
    })
  }

  describeDefaultShouldValidate(plain)
  describeDefaultShouldValidate(immutable)
})
