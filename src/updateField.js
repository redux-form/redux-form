import createOnBlur from './events/createOnBlur';
import createOnChange from './events/createOnChange';
import createOnDragStart from './events/createOnDragStart';
import createOnDrop from './events/createOnDrop';
import createOnFocus from './events/createOnFocus';
import isPristine from './isPristine';
import isValid from './isValid';
import getValues from './getValues';
import read from './read';

const stuff = (state, fieldName, pathToHere, myFields, syncErrors, addArrayValue, removeArrayValue) => {
  const dotIndex = fieldName.indexOf('.');
  const openIndex = fieldName.indexOf('[');
  const closeIndex = fieldName.indexOf(']');
  if (openIndex > 0 && closeIndex !== openIndex + 1) {
    throw new Error('found [ not followed by ]');
  }
  if (openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    // array field
    const key = fieldName.substring(0, openIndex);
    let rest = fieldName.substring(closeIndex + 1);
    if (rest[0] === '.') {
      rest = rest.substring(1);
    }
    const stateArray = state && state[key] || [];
    if (!myFields[key]) {
      myFields[key] = [];
      myFields[key].addField = (value, index) => {
        addArrayValue(pathToHere + key, index, value);
      };
      myFields[key].removeField = (index) => {
        removeArrayValue(pathToHere + key, index);
      };
    }
    const myFieldArray = myFields[key];
    stateArray.forEach((fieldState, index) => {
      stuff(fieldState, rest, `${pathToHere}${key}[${index}]${rest ? '.' : ''}`, myFieldArray[index], syncErrors,
        addArrayValue, removeArrayValue);
    });
  } else if (dotIndex > 0) {
    // subobject field
    const key = fieldName.substring(0, dotIndex);
    const rest = fieldName.substring(dotIndex + 1);
    const stateObject = state && state[key] || {};
    if (!myFields[key]) {
      myFields[key] = {};
    }
    stuff(state[key] || {}, rest, pathToHere + key + '.', myFields[key], syncErrors, addArrayValue, removeArrayValue);
  } else {
    const name = pathToHere + fieldName;
    if (!myFields[fieldName]) {
      myFields[fieldName] = {};
    }
    const field = myFields[fieldName];
    if (field.name !== name) {
      const onChange = createOnChange(name, change, isReactNative);
      const initialValue = read(name, initialValues);
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
  }
};

/**
 * Updates a field object from the store values
 */
const readField = (field, formField, active, syncError) => {
  const diff = {};

  // update field value
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
  const error = syncError || formField.submitError || formField.asyncError;
  if (error !== field.error) {
    diff.error = error;
  }
  const valid = isValid(error);
  if (field.valid !== valid) {
    diff.invalid = !valid;
    diff.valid = valid;
  }

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

  return Object.keys(diff).length ? {
    ...field,
    ...diff
  } : field;
};
export default readField;
