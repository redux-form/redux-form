import expect from 'expect';
import getDisplayName from '../getDisplayName';

describe('getDisplayName', () => {
  it('should return the displayName if set', () => {
    expect(getDisplayName({displayName: 'Foo'})).toBe('Foo');
    expect(getDisplayName({displayName: 'Bar'})).toBe('Bar');
  });

  it('should return the name if set', () => {
    expect(getDisplayName({name: 'Foo'})).toBe('Foo');
    expect(getDisplayName({name: 'Bar'})).toBe('Bar');
  });

  it('should return "Component" if neither displayName nor name is set', () => {
    expect(getDisplayName({})).toBe('Component');
  });

});
