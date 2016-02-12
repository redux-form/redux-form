import expect, {createSpy} from 'expect';
import isPromise from 'is-promise';
import handleSubmit from '../handleSubmit';

describe('handleSubmit', () => {

  it('should stop if sync validation fails', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = createSpy().andReturn(69);
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy();
    const validate = createSpy().andReturn({foo: 'error'});
    const props = {fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = false;
    const initialized = false;

    expect(handleSubmit(submit, values, props, asyncValidate, allPristine, initialized)).toBe(undefined);

    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(...fields);
    expect(validate)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toNotHaveBeenCalled();
    expect(submit).toNotHaveBeenCalled();
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    expect(submitFailed).toHaveBeenCalled();
  });

  it('should stop and return rejected promise if sync validation fails and returnRejectedSubmitPromise', (done) => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const errorValue = {foo: 'error'};
    const submit = createSpy().andReturn(69);
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy();
    const validate = createSpy().andReturn(errorValue);
    const props = {fields, startSubmit, stopSubmit, submitFailed, touch, validate, returnRejectedSubmitPromise: true};
    const allPristine = false;
    const initialized = false;

    const result = handleSubmit(submit, values, props, asyncValidate, allPristine, initialized);
    expect(isPromise(result)).toBe(true);

    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(...fields);
    expect(validate)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toNotHaveBeenCalled();
    expect(submit).toNotHaveBeenCalled();
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    expect(submitFailed).toHaveBeenCalled();
    result.then(() => {
      expect(false).toBe(true); // should not be in resolve branch
    }, (error) => {
      expect(error).toBe(errorValue);
      done();
    });
  });

  it('should return result of sync submit', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = createSpy().andReturn(69);
    const dispatch = () => null;
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy();
    const validate = createSpy().andReturn({});
    const props = {dispatch, fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = false;
    const initialized = false;

    expect(handleSubmit(submit, values, props, asyncValidate, allPristine, initialized)).toBe(69);

    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(...fields);
    expect(validate)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, props);
    expect(asyncValidate)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith();
    expect(submit)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, dispatch);
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    expect(submitFailed).toNotHaveBeenCalled();
  });

  it('should not submit if async validation fails', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = createSpy().andReturn(69);
    const dispatch = () => null;
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy().andReturn(Promise.reject());
    const validate = createSpy().andReturn({});
    const props = {dispatch, fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = false;
    const initialized = false;

    return handleSubmit(submit, values, props, asyncValidate, allPristine, initialized)
      .then(result => {
        expect(result).toBe(undefined);
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(...fields);
        expect(validate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, props);
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith();
        expect(submit).toNotHaveBeenCalled();
        expect(startSubmit).toNotHaveBeenCalled();
        expect(stopSubmit).toNotHaveBeenCalled();
        expect(submitFailed).toHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not get into reject branch
      });
  });

  it('should not submit if async validation fails and return rejected promise', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = createSpy().andReturn(69);
    const dispatch = () => null;
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy().andReturn(Promise.reject());
    const validate = createSpy().andReturn({});
    const props = {
      dispatch, fields, startSubmit, stopSubmit, submitFailed, touch, validate,
      returnRejectedSubmitPromise: true
    };
    const allPristine = false;
    const initialized = false;

    return handleSubmit(submit, values, props, asyncValidate, allPristine, initialized)
      .then(() => {
        expect(false).toBe(true); // should not get into resolve branch
      }, result => {
        expect(result).toBe(undefined);
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(...fields);
        expect(validate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, props);
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith();
        expect(submit).toNotHaveBeenCalled();
        expect(startSubmit).toNotHaveBeenCalled();
        expect(stopSubmit).toNotHaveBeenCalled();
        expect(submitFailed).toHaveBeenCalled();
      });
  });

  it('should sync submit if async validation passes', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = createSpy().andReturn(69);
    const dispatch = () => null;
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy().andReturn(Promise.resolve());
    const validate = createSpy().andReturn({});
    const props = {dispatch, fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = false;
    const initialized = false;

    return handleSubmit(submit, values, props, asyncValidate, allPristine, initialized)
      .then(result => {
        expect(result).toBe(69);
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(...fields);
        expect(validate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, props);
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith();
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch);
        expect(startSubmit).toNotHaveBeenCalled();
        expect(stopSubmit).toNotHaveBeenCalled();
        expect(submitFailed).toNotHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not get into reject branch
      });
  });

  it('should async submit if async validation passes', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = createSpy().andReturn(Promise.resolve(69));
    const dispatch = () => null;
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy().andReturn(Promise.resolve());
    const validate = createSpy().andReturn({});
    const props = {dispatch, fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = false;
    const initialized = false;

    return handleSubmit(submit, values, props, asyncValidate, allPristine, initialized)
      .then(result => {
        expect(result).toBe(69);
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(...fields);
        expect(validate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, props);
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith();
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch);
        expect(startSubmit).toHaveBeenCalled();
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith();
        expect(submitFailed).toNotHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not get into reject branch
      });
  });

  it('should set submit errors if async submit fails', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submitErrors = {foo: 'error'};
    const submit = createSpy().andReturn(Promise.reject(submitErrors));
    const dispatch = () => null;
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy().andReturn(Promise.resolve());
    const validate = createSpy().andReturn({});
    const props = {dispatch, fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = false;
    const initialized = false;

    return handleSubmit(submit, values, props, asyncValidate, allPristine, initialized)
      .then(result => {
        expect(result).toBe(undefined);
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(...fields);
        expect(validate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, props);
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith();
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch);
        expect(startSubmit).toHaveBeenCalled();
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(submitErrors);
        expect(submitFailed).toNotHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not get into reject branch
      });
  });

  it('should set submit errors if async submit fails and return rejected promise', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submitErrors = {foo: 'error'};
    const submit = createSpy().andReturn(Promise.reject(submitErrors));
    const dispatch = () => null;
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy().andReturn(Promise.resolve());
    const validate = createSpy().andReturn({});
    const props = {
      dispatch, fields, startSubmit, stopSubmit, submitFailed, touch, validate,
      returnRejectedSubmitPromise: true
    };
    const allPristine = false;
    const initialized = false;

    return handleSubmit(submit, values, props, asyncValidate, allPristine, initialized)
      .then(() => {
        expect(false).toBe(true); // should not get into resolve branch
      }, result => {
        expect(result).toBe(submitErrors);
        expect(touch)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(...fields);
        expect(validate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, props);
        expect(asyncValidate)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith();
        expect(submit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(values, dispatch);
        expect(startSubmit).toHaveBeenCalled();
        expect(stopSubmit)
          .toHaveBeenCalled()
          .toHaveBeenCalledWith(submitErrors);
        expect(submitFailed).toNotHaveBeenCalled();
      });
  });

  it('should fire async validation if sync validation passes and form is dirty', (done) => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const errorValue = {foo: 'error'};
    const submit = createSpy().andReturn(69);
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    const validate = createSpy().andReturn({});  // sync validation passes
    const props = {fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = false;
    const initialized = true;

    const result = handleSubmit(submit, values, props, asyncValidate, allPristine, initialized);
    expect(isPromise(result)).toBe(true);

    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(...fields);
    expect(validate)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toHaveBeenCalled();
    expect(submit).toNotHaveBeenCalled();
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    result
      .then(() => {
        expect(submitFailed).toHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not be in resolve branch
      })
      .then(done, done);
  });

  it('should fire async validation if sync validation passes and has not been initialized', (done) => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const errorValue = {foo: 'error'};
    const submit = createSpy().andReturn(69);
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy().andReturn(Promise.reject(errorValue));
    const validate = createSpy().andReturn({});  // sync validation passes
    const props = {fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = true;
    const initialized = false;

    const result = handleSubmit(submit, values, props, asyncValidate, allPristine, initialized);
    expect(isPromise(result)).toBe(true);

    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(...fields);
    expect(validate)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toHaveBeenCalled();
    expect(submit).toNotHaveBeenCalled();
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    result
      .then(() => {
        expect(submitFailed).toHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not be in resolve branch
      })
      .then(done, done);
  });

  it('should NOT fire async validation if form has been initialized and is pristine', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = createSpy().andReturn(69);
    const touch = createSpy();
    const startSubmit = createSpy();
    const stopSubmit = createSpy();
    const submitFailed = createSpy();
    const asyncValidate = createSpy();
    const validate = createSpy().andReturn({});  // sync validation passes
    const props = {fields, startSubmit, stopSubmit, submitFailed, touch, validate};
    const allPristine = true;
    const initialized = true;

    const result = handleSubmit(submit, values, props, asyncValidate, allPristine, initialized);
    expect(result).toBe(69);

    expect(touch)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(...fields);
    expect(validate)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toNotHaveBeenCalled();
    expect(submit).toHaveBeenCalled();
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    expect(submitFailed).toNotHaveBeenCalled();
  });
});
