import expect, {createSpy} from 'expect';
import silenceEvent from '../silenceEvent';

describe('silenceEvent', () => {
  it('should return false if not an event', () => {
    expect(silenceEvent(undefined)).toBe(false);
    expect(silenceEvent(null)).toBe(false);
    expect(silenceEvent(true)).toBe(false);
    expect(silenceEvent(42)).toBe(false);
    expect(silenceEvent({})).toBe(false);
    expect(silenceEvent([])).toBe(false);
    expect(silenceEvent(() => null)).toBe(false);
  });

  it('should return true if an event', () => {
    expect(silenceEvent({
      target: 'foo',
      preventDefault: () => null,
      stopPropagation: () => null
    })).toBe(true);
  });

  it('should call preventDefault and stopPropagation', () => {
    const preventDefault = createSpy();
    const stopPropagation = createSpy();

    silenceEvent({
      target: 'foo',
      preventDefault,
      stopPropagation
    });
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toNotHaveBeenCalled();
  });
});
