import expect, {createSpy} from 'expect';
import createOnChange from '../createOnChange';

describe('createOnChange', () => {
  it('should return a function', () => {
    expect(createOnChange())
      .toExist()
      .toBeA('function');
  });

  it('should return a function that calls change with name and value', () => {
    const change = createSpy();
    createOnChange('foo', change)('bar');
    expect(change)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'bar');
  });

});
