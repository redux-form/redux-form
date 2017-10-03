import getDisplayName from '../getDisplayName'

describe('getDisplayName', () => {
  it('should read displayName', () => {
    expect(getDisplayName({ displayName: 'foo' })).toBe('foo')
  })

  it('should read name', () => {
    expect(getDisplayName({ name: 'foo' })).toBe('foo')
  })

  it('should default to Component', () => {
    expect(getDisplayName({})).toBe('Component')
  })
})
