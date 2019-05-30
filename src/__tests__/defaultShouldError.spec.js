import plain from '../structure/plain'
import immutable from '../structure/immutable'
import defaultShouldError from '../defaultShouldError'

describe('defaultShouldError', () => {
  it('should validate when initialRender is true', () => {
    expect(
      defaultShouldError({
        initialRender: true
      })
    ).toBe(true)
  })

  const describeDefaultShouldError = structure => {
    const { fromJS } = structure

    it('should validate if values have changed', () => {
      expect(
        defaultShouldError({
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
        })
      ).toBe(true)
    })

    it('should not validate if values have not changed', () => {
      expect(
        defaultShouldError({
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
        })
      ).toBe(false)
    })
    it('should validate if field validator keys have changed', () => {
      expect(
        defaultShouldError({
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
        })
      ).toBe(true)
    })

    it('should not validate if field validator keys have not changed', () => {
      expect(
        defaultShouldError({
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
        })
      ).toBe(false)
    })
  }

  describeDefaultShouldError(plain)
  describeDefaultShouldError(immutable)
})
