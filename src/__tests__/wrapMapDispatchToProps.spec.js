import expect, {createSpy} from 'expect';
import wrapMapDispatchToProps from '../wrapMapDispatchToProps';

const createRestorableSpy = () =>
  createSpy(() => null, function resetCalls() { // i'm not sure why expect doesn't do this by default
    this.calls = [];
  });

describe('wrapMapDispatchToProps', () => {
  it('should bind action creators if no mapDispatchToProps given', () => {
    const actionCreators = {
      a: createSpy(),
      b: createSpy()
    };
    const result = wrapMapDispatchToProps(undefined, actionCreators);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    const dispatch = createRestorableSpy();
    const mapped = result(dispatch);
    expect(mapped).toBeA('object');
    expect(mapped.a).toBeA('function');
    expect(mapped.b).toBeA('function');

    mapped.a('foo');
    expect(actionCreators.a)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should bind action creators if object mapDispatchToProps given', () => {
    const actionCreators = {
      a: createSpy(),
      b: createSpy()
    };
    const mapDispatchToProps = {
      c: createSpy(),
      d: createSpy()
    };
    const result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    const dispatch = createRestorableSpy();
    const mapped = result(dispatch);
    expect(mapped).toBeA('object');
    expect(mapped.a).toBeA('function');
    expect(mapped.b).toBeA('function');
    expect(mapped.c).toBeA('function');
    expect(mapped.d).toBeA('function');

    mapped.a('foo');
    expect(actionCreators.a)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.c('bar');
    expect(mapDispatchToProps.c)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('bar');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.d();
    expect(mapDispatchToProps.d).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should call mapDispatchToProps when one-param function given', () => {
    const actionCreators = {
      a: createSpy(),
      b: createSpy()
    };
    const mapDispatchToPropsSpy = createSpy().andReturn({c: 42, d: true});
    const mapDispatchToProps = dispatch => mapDispatchToPropsSpy(dispatch);
    expect(mapDispatchToProps.length).toBe(1);

    const result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    const dispatch = createRestorableSpy();
    const mapped = result(dispatch);
    expect(mapDispatchToPropsSpy)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(dispatch);

    expect(mapped).toBeA('object');
    expect(mapped.a).toBeA('function');
    expect(mapped.b).toBeA('function');
    expect(mapped.c).toBe(42);
    expect(mapped.d).toBe(true);

    mapped.a('foo');
    expect(actionCreators.a)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should call mapDispatchToProps when two-param function given', () => {
    const actionCreators = {
      a: createSpy(),
      b: createSpy()
    };
    const mapDispatchToPropsSpy = createSpy().andReturn({c: 42, d: true});
    const mapDispatchToProps = (dispatch, ownProps) => mapDispatchToPropsSpy(dispatch, ownProps);
    expect(mapDispatchToProps.length).toBe(2);

    const result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(result).toBeA('function');
    expect(result.length).toBe(2);
    const dispatch = createRestorableSpy();
    const mapped = result(dispatch, 75);
    expect(mapDispatchToPropsSpy)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(dispatch, 75);

    expect(mapped).toBeA('object');
    expect(mapped.a).toBeA('function');
    expect(mapped.b).toBeA('function');
    expect(mapped.c).toBe(42);
    expect(mapped.d).toBe(true);

    mapped.a('foo');
    expect(actionCreators.a)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
});
