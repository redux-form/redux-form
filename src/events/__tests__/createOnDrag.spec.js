import expect, {createSpy} from 'expect';
import createOnDrag, {dataKey} from '../createOnDrag';

describe('createOnDrag', () => {
  it('should return a function', () => {
    expect(createOnDrag())
      .toExist()
      .toBeA('function');
  });

  it('should return a function that calls dataTransfer.setData with key and result from getValue', () => {
    const getValue = createSpy().andReturn('bar');
    const setData = createSpy();
    createOnDrag('foo', getValue)({
      dataTransfer: {setData}
    });
    expect(getValue).toHaveBeenCalled();
    expect(setData)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(dataKey, 'bar');
  });

});
