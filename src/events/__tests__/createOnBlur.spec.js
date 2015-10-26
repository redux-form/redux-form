import expect, {createSpy} from 'expect';
import createOnBlur from '../createOnBlur';

describe('createOnBlur', () => {
  it('should return a function', () => {
    expect(createOnBlur())
      .toExist()
      .toBeA('function');
  });

  it('should return a function that calls blur with name and value', () => {
    const blur = createSpy();
    createOnBlur('foo', blur)('bar');
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'bar');
  });

  it('should return a function that calls blur with name and value from event', () => {
    const blur = createSpy();
    createOnBlur('foo', blur)({
      target: {
        value: 'bar'
      },
      preventDefault: () => null,
      stopPropagation: () => null
    });
    expect(blur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'bar');
  });

  it('should return a function that calls blur and then afterBlur with name and value', () => {
    const blur = createSpy();
    const afterBlur = createSpy();
    createOnBlur('foo', blur, false, afterBlur)('bar');
    expect(blur).toHaveBeenCalled();
    expect(afterBlur)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo', 'bar');
  });

});
