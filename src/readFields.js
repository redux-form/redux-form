import createOnBlur from './events/createOnBlur';
import createOnChange from './events/createOnChange';
import createOnDragStart from './events/createOnDragStart';
import createOnDrop from './events/createOnDrop';
import createOnFocus from './events/createOnFocus';
import read from './read';
import readField from './readField';
import write from './write';
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

    const result = readField(field, formField, form._active === name, syncError);

    if (result.invalid) {
      allValid = false;
    }
    if (result.dirty) {
      allPristine = false;
    }
    write(name, result, accumulator);
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
