import createOnBlur from './events/createOnBlur';
import createOnChange from './events/createOnChange';
import createOnDrag from './events/createOnDrag';
import createOnDrop from './events/createOnDrop';
import createOnFocus from './events/createOnFocus';
import isPristine from './isPristine';
import isValid from './isValid';
import getValues from './getValues';

/**
 * Reads props and generates (or updates) field structure
 */
const readFields = (props, myFields, isReactNative) => {
  const {blur, change, fields, focus, form, initialValues, validate} = props;
  const values = getValues(fields, form);
  const syncErrors = validate(values, props);
  let allValid = true;
  let allPristine = true;
  fields.forEach(name => {
    const field = myFields[name] || {};

    // create field if it does not exist
    if (field.name !== name) {
      const onChange = createOnChange(name, change, isReactNative);
      const initialValue = initialValues && initialValues[name];
      field.name = name;
      field.defaultChecked = initialValue;
      field.defaultValue = initialValue;
      field.onBlur = createOnBlur(name, blur, isReactNative);
      field.onChange = onChange;
      field.onDrag = createOnDrag(name, () => field.value);
      field.onDrop = createOnDrop(name, change);
      field.onFocus = createOnFocus(name, focus);
      field.onUpdate = onChange; // alias to support belle. https://github.com/nikgraf/belle/issues/58
    }

    // update field value
    const formField = form[name];
    if (field.value !== formField.value) {
      const pristine = isPristine(formField.value, formField.initial);
      field.dirty = !pristine;
      field.pristine = pristine;
      field.value = formField.value;
    }

    // update field error
    const error = syncErrors[name] || formField.asyncError || formField.submitError;
    if (field.error !== error) {
      const valid = isValid(error);
      field.invalid = !valid;
      field.error = error;
      field.valid = valid;
    }

    field.active = form._active === name;
    field.touched = formField.touched;
    field.visited = formField.visited;

    if (field.invalid) {
      allValid = false;
    }
    if (field.dirty) {
      allPristine = false;
    }
    myFields[name] = field;
  });
  // a little hacky to tack these flags onto the array, but the calculation is done here and needed in render()
  myFields.allPristine = allPristine;
  myFields.allValid = allValid;
  myFields.values = values;
  myFields.syncErrors = syncErrors;
};
export default readFields;
