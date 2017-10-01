import expect from 'expect'
import plain from '../structure/plain'
import immutable from '../structure/immutable'
import defaultShouldWarn from '../defaultShouldWarn'

describe('defaultShouldWarn', () => {
  it('should warn when initialRender is true', () => {
    expect(
      defaultShouldWarn({
        initialRender: true
      })
    ).toBe(true)
  })

  const describeDefaultShouldWarn = structure => {
    const { fromJS } = structure

    it('should warn if values have changed', () => {
      expect(
        defaultShouldWarn({
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

    it('should not warn if values have not changed', () => {
      expect(
        defaultShouldWarn({
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
    it('should warn if field validator keys have changed', () => {
      expect(
        defaultShouldWarn({
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

    it('should not warn if field validator keys have not changed', () => {
      expect(
        defaultShouldWarn({
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

  describeDefaultShouldWarn(plain)
  describeDefaultShouldWarn(immutable)
})

