import expect, {createSpy} from 'expect';
import readField from '../readField';

describe('readField', () => {
  it('should return new field object when something changes', () => {
    const field = {value: 'foo'};
    const result = readField(field, {value: 'bar'}, false, undefined);
    expect(result).toNotBe(field);
  });

  it('should set value', () => {
    expect(readField({}, {value: 'foo'}, true, undefined).value).toBe('foo');
    expect(readField({value: 'foo'}, {value: 'bar'}, true, undefined).value).toBe('bar');
    expect(readField({}, {value: 42}, true, undefined).value).toBe(42);
    expect(readField({value: 3}, {value: 42}, true, undefined).value).toBe(42);
  });

  it('should set pristine and dirty', () => {
    const result1 = readField({}, {value: 'foo', initial: 'foo'}, false, undefined);
    expect(result1.dirty).toBe(false);
    expect(result1.pristine).toBe(true);
    const result2 = readField({}, {value: 'foo', initial: 'bar'}, false, undefined);
    expect(result2.dirty).toBe(true);
    expect(result2.pristine).toBe(false);

    // test that it overwrites existing flags
    const result3 = readField({dirty: true, pristine: false}, {value: 'foo', initial: 'foo'}, false, undefined);
    expect(result3.dirty).toBe(false);
    expect(result3.pristine).toBe(true);
    const result4 = readField({dirty: false, pristine: true}, {value: 'foo', initial: 'bar'}, false, undefined);
    expect(result4.dirty).toBe(true);
    expect(result4.pristine).toBe(false);
  });

  it('should have no error when no errors', () => {
    expect(readField({}, {}, false, undefined).error).toBe(undefined);
  });

  it('should set error from sync error', () => {
    expect(readField({}, {}, false, 'foo').error).toBe('foo');
    expect(readField({}, {}, false, 'bar').error).toBe('bar');
  });

  it('should set error from submit error', () => {
    expect(readField({}, {submitError: 'foo'}, false, undefined).error).toBe('foo');
    expect(readField({}, {submitError: 'bar'}, false, undefined).error).toBe('bar');
  });

  it('should set error from async error', () => {
    expect(readField({}, {asyncError: 'foo'}, false, undefined).error).toBe('foo');
    expect(readField({}, {asyncError: 'bar'}, false, undefined).error).toBe('bar');
  });

  it('should prioritize submit error over async error', () => {
    expect(readField({}, {asyncError: 'fooAsync', submitError: 'fooSubmit'}, false, undefined).error).toBe('fooSubmit');
    expect(readField({}, {asyncError: 'barAsync', submitError: 'barSubmit'}, false, undefined).error).toBe('barSubmit');
  });

  it('should prioritize sync error over async error', () => {
    expect(readField({}, {asyncError: 'fooAsync'}, false, 'fooSync').error).toBe('fooSync');
    expect(readField({}, {asyncError: 'barAsync'}, false, 'barSync').error).toBe('barSync');
  });

  it('should prioritize sync error over submit error', () => {
    expect(readField({}, {submitError: 'fooSubmit'}, false, 'fooSync').error).toBe('fooSync');
    expect(readField({}, {submitError: 'barSubmit'}, false, 'barSync').error).toBe('barSync');
  });

  it('should prioritize sync error over submit and async error', () => {
    expect(readField({}, {asyncError: 'fooAsync', submitError: 'fooSubmit'}, false, 'fooSync').error).toBe('fooSync');
    expect(readField({}, {asyncError: 'barAsync', submitError: 'barSubmit'}, false, 'barSync').error).toBe('barSync');
  });

  it('should set valid/invalid', () => {
    const result1 = readField({}, {}, false, undefined);
    expect(result1.valid).toBe(true)
    expect(result1.invalid).toBe(false)
    const result2 = readField({}, {}, false, 'sync error');
    expect(result2.valid).toBe(false)
    expect(result2.invalid).toBe(true)

    // test that it overwrites existing flags
    const result3 = readField({valid: false, invalid: true}, {}, false, undefined);
    expect(result3.valid).toBe(true)
    expect(result3.invalid).toBe(false)
    const result4 = readField({valid: true, invalid: false}, {}, false, 'sync error');
    expect(result4.valid).toBe(false)
    expect(result4.invalid).toBe(true)
  });

  it('should set active', () => {
    expect(readField({}, {}, true, undefined).active).toBe(true);
    expect(readField({active: false}, {}, true, undefined).active).toBe(true);
    expect(readField({}, {}, false, undefined).active).toBe(false);
    expect(readField({active: true}, {}, false, undefined).active).toBe(false);
  });

  it('should set touched', () => {
    // init
    expect(readField({}, {touched: true}, false, undefined).touched).toBe(true);
    expect(readField({}, {touched: false}, false, undefined).touched).toBe(false);
    expect(readField({}, {}, false, undefined).touched).toBe(false);
    // update
    expect(readField({touched: false}, {touched: true}, false, undefined).touched).toBe(true);
    expect(readField({touched: true}, {touched: false}, false, undefined).touched).toBe(false);
    expect(readField({touched: true}, {}, false, undefined).touched).toBe(false);
  });

  it('should set visited', () => {
    // init
    expect(readField({}, {visited: true}, false, undefined).visited).toBe(true);
    expect(readField({}, {visited: false}, false, undefined).visited).toBe(false);
    expect(readField({}, {}, false, undefined).visited).toBe(false);
    // update
    expect(readField({visited: false}, {visited: true}, false, undefined).visited).toBe(true);
    expect(readField({visited: true}, {visited: false}, false, undefined).visited).toBe(false);
    expect(readField({visited: true}, {}, false, undefined).visited).toBe(false);
  });
});
