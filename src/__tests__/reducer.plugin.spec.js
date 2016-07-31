const describePlugin = (vanillaReducer, expect, { fromJS, deleteIn }) => () => {
  it('should initialize state when a plugin is given', () => {
    const reducer = vanillaReducer.plugin({
      foo: state => state
    })
    const state = reducer()
    expect(state)
      .toExist()
      .toBeAMap()
      .toBeSize(0)
  })

  it('should let plugin reducer respond to another action type', () => {
    const state1 = fromJS({
      foo: {
        values: {
          cat: 'dog',
          rat: 'hog'
        },
        fields: {
          cat: { touched: true },
          rat: { touched: true }
        }
      }
    })

    const plugin = (state, action) => {
      if (action.type === 'RAT_POISON') {
        let result = state
        result = deleteIn(result, 'values.rat')
        result = deleteIn(result, 'fields.rat')
        return result
      }
      return state
    }

    const reducer = vanillaReducer.plugin({ foo: plugin })

    const state2 = reducer(state1, { type: 'MILK', form: 'foo' })
    expect(state2).toBe(state1) // no change

    const state3 = reducer(state2, { type: 'RAT_POISON', form: 'foo' })
    expect(state3)
      .toEqualMap({
        foo: {
          values: {
            cat: 'dog'
          },
          fields: {
            cat: { touched: true }
          }
        }
      })
  })

  it('should only respond to form specified', () => {
    const state1 = fromJS({
      foo: {
        values: {
          cat: 'dog',
          rat: 'hog'
        },
        fields: {
          cat: { touched: true },
          rat: { touched: true }
        }
      },
      bar: {
        values: {
          cat: 'dog',
          rat: 'hog'
        },
        fields: {
          cat: { touched: true },
          rat: { touched: true }
        }
      }
    })

    const plugin = (state, action) => {
      if (action.type === 'RAT_POISON') {
        let result = state
        result = deleteIn(result, 'values.rat')
        result = deleteIn(result, 'fields.rat')
        return result
      }
      return state
    }

    const reducer = vanillaReducer.plugin({ foo: plugin })

    const state2 = reducer(state1, { type: 'MILK', form: 'foo' })
    expect(state2).toBe(state1) // no change

    const state3 = reducer(state2, { type: 'RAT_POISON', form: 'foo' })
    expect(state3)
      .toEqualMap({
        foo: {
          values: {
            cat: 'dog'
          },
          fields: {
            cat: { touched: true }
          }
        },
        bar: {
          values: {
            cat: 'dog',
            rat: 'hog'
          },
          fields: {
            cat: { touched: true },
            rat: { touched: true }
          }
        }
      })
  })
}

export default describePlugin
