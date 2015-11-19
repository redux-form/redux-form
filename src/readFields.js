import createOnBlur from './events/createOnBlur';
import createOnChange from './events/createOnChange';
import createOnDragStart from './events/createOnDragStart';
import createOnDrop from './events/createOnDrop';
import createOnFocus from './events/createOnFocus';
import isPristine from './isPristine';
import isValid from './isValid';
import getValues from './getValues';
import silencePromise from './silencePromise';

/**
 * Reads props and generates (or updates) field structure
 */
const readFields = (props, myFields, asyncValidate, isReactNative) => {
  const {asyncBlurFields, blur, change, fields, focus, form, initialValues, readonly, validate} = props;
  const values = getValues(fields, form);
  const syncErrors = validate(values, props);
  const errors = {};
  const formError = syncErrors._error || form._error;
  let allValid = !formError;
  let allPristine = true;
  const fieldObjects = fields.reduce((accumulator, name) => {
    const field = myFields[name] || {};
    const diff = {};

    // create field if it does not exist
    if (field.name !== name) {
      const onChange = createOnChange(name, change, isReactNative);
      const initialValue = initialValues && initialValues[name];
      field.name = name;
      field.defaultChecked = initialValue === true;
      field.defaultValue = initialValue;
      if (!readonly) {
        field.onBlur = createOnBlur(name, blur, isReactNative,
          ~asyncBlurFields.indexOf(name) && ((blurName, blurValue) => silencePromise(asyncValidate(blurName, blurValue))));
        field.onChange = onChange;
        field.onDragStart = createOnDragStart(name, () => field.value);
        field.onDrop = createOnDrop(name, change);
        field.onFocus = createOnFocus(name, focus);
        field.onUpdate = onChange; // alias to support belle. https://github.com/nikgraf/belle/issues/58
      }
      field.valid = true;
      field.invalid = false;
    }

    // update field value
    const formField = form[name] || {};
    if (field.value !== formField.value) {
      diff.value = formField.value;
      diff.checked = typeof formField.value === 'boolean' ? formField.value : undefined;
    }

    // update dirty/pristine
    const pristine = isPristine(formField.value, formField.initial);
    if (field.pristine !== pristine) {
      diff.dirty = !pristine;
      diff.pristine = pristine;
    }

    // update field error
    const error = syncErrors[name] || formField.submitError || formField.asyncError;
    if (error !== field.error) {
      diff.error = error;
    }
    const valid = isValid(error);
    if (field.valid !== valid) {
      diff.invalid = !valid;
      diff.valid = valid;
    }
    if (error) {
      errors[name] = error;
    }

    const active = form._active === name;
    if (active !== field.active) {
      diff.active = active;
    }
    const touched = !!formField.touched;
    if (touched !== field.touched) {
      diff.touched = touched;
    }
    const visited = !!formField.visited;
    if (visited !== field.visited) {
      diff.visited = visited;
    }

    const result = Object.keys(diff).length ? {
      ...field,
      ...diff
    } : field;

    if (result.invalid) {
      allValid = false;
    }
    if (result.dirty) {
      allPristine = false;
    }
    accumulator[name] = result;
    return accumulator;
  }, {});
  Object.defineProperty(fieldObjects, '_meta', {
    value: {
      allPristine,
      allValid,
      values,
      errors,
      formError
    }
  });
  return fieldObjects;
};
export default readFields;
