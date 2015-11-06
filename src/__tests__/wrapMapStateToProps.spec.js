import expect, {createSpy} from 'expect';
import wrapMapStateToProps from '../wrapMapStateToProps';

describe('wrapMapStateToProps', () => {
  it('should save form if no mapStateToProps given', () => {
    const getForm = createSpy().andReturn('foo');
    const result = wrapMapStateToProps(undefined, getForm);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    const mapped = result('bar');
    expect(getForm)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar');
    expect(mapped).toEqual({form: 'foo'});
  });

  it('should throw error when mapStateToProps is not a function', () => {
    const getForm = createSpy();
    expect(() => wrapMapStateToProps(true, getForm)).toThrow('mapStateToProps must be a function');
    expect(() => wrapMapStateToProps(42, getForm)).toThrow('mapStateToProps must be a function');
    expect(() => wrapMapStateToProps({}, getForm)).toThrow('mapStateToProps must be a function');
    expect(() => wrapMapStateToProps([], getForm)).toThrow('mapStateToProps must be a function');
    expect(getForm).toNotHaveBeenCalled();
  });

  it('should call mapStateToProps when one-param function given', () => {
    const getForm = createSpy().andReturn('foo');
    const mapStateToPropsSpy = createSpy().andReturn({a: 42, b: true, c: 'baz'});
    const mapStateToProps = state => mapStateToPropsSpy(state);
    expect(mapStateToProps.length).toBe(1);

    const result = wrapMapStateToProps(mapStateToProps, getForm);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    const mapped = result('bar');
    expect(mapStateToPropsSpy)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar');
    expect(getForm)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar');

    expect(mapped).toEqual({
      a: 42,
      b: true,
      c: 'baz',
      form: 'foo'
    });
  });

  it('should call mapStateToProps when two-param function given', () => {
    const getForm = createSpy().andReturn('foo');
    const mapStateToPropsSpy = createSpy().andReturn({a: 42, b: true, c: 'baz'});
    const mapStateToProps = (state, ownProps) => mapStateToPropsSpy(state, ownProps);
    expect(mapStateToProps.length).toBe(2);

    const result = wrapMapStateToProps(mapStateToProps, getForm);
    expect(result).toBeA('function');
    expect(result.length).toBe(2);
    const mapped = result('bar', 'dog');
    expect(mapStateToPropsSpy)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar', 'dog');
    expect(getForm)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar');

    expect(mapped).toEqual({
      a: 42,
      b: true,
      c: 'baz',
      form: 'foo'
    });
  });
});
