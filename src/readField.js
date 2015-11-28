import createOnBlur from './events/createOnBlur';
import createOnChange from './events/createOnChange';
import createOnDragStart from './events/createOnDragStart';
import createOnDrop from './events/createOnDrop';
import createOnFocus from './events/createOnFocus';
import silencePromise from './silencePromise';
import read from './read';
import updateField from './updateField';

const readField = (state, fieldName, pathToHere = '', fields, syncErrors, asyncValidate, isReactNative, props) => {
  const {asyncBlurFields, blur, change, focus, form, initialValues, readonly, addArrayValue, removeArrayValue} = props;
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
    if (!fields[key]) {
      fields[key] = [];
      fields[key].addField = (value, index) => {
        addArrayValue(pathToHere + key, value, index);
      };
      fields[key].removeField = index => {
        removeArrayValue(pathToHere + key, index);
      };
    }
    const fieldArray = fields[key];
    stateArray.forEach((fieldState, index) => {
      if (rest && !fieldArray[index]) {
        fieldArray[index] = {};
      }
      const dest = rest ? fieldArray[index] : {};
      const result = readField(fieldState, rest, `${pathToHere}${key}[${index}]${rest ? '.' : ''}`, dest, syncErrors,
        asyncValidate, isReactNative, props);
      if (!rest) { // if nothing after [] in field name, assign directly to array
        fieldArray[index] = result;
      }
    });
    if (fieldArray.length > stateArray.length) {
      // remove extra items that aren't in state array
      fieldArray.splice(stateArray.length, fieldArray.length - stateArray.length);
    }
    return fieldArray;
  }
  if (dotIndex > 0) {
    // subobject field
    const key = fieldName.substring(0, dotIndex);
    const rest = fieldName.substring(dotIndex + 1);
    if (!fields[key]) {
      fields[key] = {};
    }
    return readField(state[key] || {}, rest, pathToHere + key + '.', fields[key], syncErrors, asyncValidate,
      isReactNative, props);
  }
  const name = pathToHere + fieldName;
  const field = fields[fieldName] || {};
  if (field.name !== name) {
    const onChange = createOnChange(name, change, isReactNative);
    const initialValue = read(name, initialValues);
    field.name = name;
    field.defaultChecked = initialValue === true;
    field.defaultValue = initialValue;
    field.initialValue = initialValue;
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

  const fieldState = (fieldName ? state[fieldName] : state) || {};
  const syncError = read(name, syncErrors);
  const updated = updateField(field, fieldState, name === form._active, syncError);
  if (fieldName || fields[fieldName] !== updated) {
    fields[fieldName] = updated;
  }
  return updated;
};

export default readField;
