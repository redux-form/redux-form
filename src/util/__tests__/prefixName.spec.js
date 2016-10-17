import expect from 'expect'
import prefixName from '../prefixName'

describe('prefixName', () => {
  it('should concat sectionPrefix and name', () => {
    const context = {
      _reduxForm: {
        sectionPrefix: 'foo'
      }
    }
    expect(prefixName(context,'bar')).toBe('foo.bar')
  })

  it('should ignore empty sectionPrefix', () => {
    const context = {
      _reduxForm: {
        sectionPrefix: undefined
      }
    }
    expect(prefixName(context, 'bar')).toBe('bar')
  })

  it('should not prefix array fields', () => {
    const context = {
      _reduxForm: {
        sectionPrefix: 'foo'
      }
    }
    expect(prefixName(context, 'bar.bar[0]')).toBe('bar.bar[0]')
  })
})
