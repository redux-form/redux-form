import expect, {createSpy} from 'expect';
import createOnDragStart, {dataKey} from '../createOnDragStart';

describe('createOnDragStart', () => {
  it('should return a function', () => {
    expect(createOnDragStart())
      .toExist()
      .toBeA('function');
  });

  it('should return a function that calls dataTransfer.setData with key and result from getValue', () => {
    const getValue = createSpy().andReturn('bar');
    const setData = createSpy();
    createOnDragStart('foo', getValue)({
      dataTransfer: {setData}
    });
    expect(getValue).toHaveBeenCalled();
    expect(setData)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(dataKey, 'bar');
  });

});
