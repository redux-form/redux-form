import expect from 'expect'
import prefixName from '../prefixName'

describe('prefixName', () => {
  it('should concat sectionPrefix and name', () => {
    const context = {
      _reduxForm: {
        sectionPrefix: 'foo',
      },
    }
    expect(prefixName(context, 'bar')).toBe('foo.bar')
  })

  it('should ignore empty sectionPrefix', () => {
    const context = {
      _reduxForm: {
        sectionPrefix: undefined,
      },
    }
    expect(prefixName(context, 'bar')).toBe('bar')
  })
})
