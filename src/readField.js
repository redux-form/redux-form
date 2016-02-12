import createOnBlur from './events/createOnBlur';
import createOnChange from './events/createOnChange';
import createOnDragStart from './events/createOnDragStart';
import createOnDrop from './events/createOnDrop';
import createOnFocus from './events/createOnFocus';
import silencePromise from './silencePromise';
import read from './read';
import updateField from './updateField';

function getSuffix(input, closeIndex) {
  let suffix = input.substring(closeIndex + 1);
  if (suffix[0] === '.') {
    suffix = suffix.substring(1);
  }
  return suffix;
}

const readField = (state, fieldName, pathToHere = '', fields, syncErrors, asyncValidate, isReactNative, props, callback = () => null, prefix = '') => {
  const {asyncBlurFields, blur, change, focus, form, initialValues, readonly, addArrayValue,
    removeArrayValue, swapArrayValues} = props;
  const dotIndex = fieldName.indexOf('.');
  const openIndex = fieldName.indexOf('[');
  const closeIndex = fieldName.indexOf(']');
  if (openIndex > 0 && closeIndex !== openIndex + 1) {
    throw new Error('found [ not followed by ]');
  }

  if (openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    // array field
    const key = fieldName.substring(0, openIndex);
    const rest = getSuffix(fieldName, closeIndex);
    const stateArray = state && state[key] || [];
    const fullPrefix = prefix + fieldName.substring(0, closeIndex + 1);
    const subfields = props.fields
      .reduce((accumulator, field) => {
        if (field.indexOf(fullPrefix) === 0) {
          accumulator.push(field);
        }
        return accumulator;
      }, [])
      .map(field => getSuffix(field, prefix.length + closeIndex));
    if (!fields[key] || fields[key].length !== stateArray.length) {
      fields[key] = fields[key] ? [...fields[key]] : [];
      Object.defineProperty(fields[key], 'addField', {
        value: (value, index) => addArrayValue(pathToHere + key, value, index, subfields)
      });
      Object.defineProperty(fields[key], 'removeField', {
        value: index => removeArrayValue(pathToHere + key, index)
      });
      Object.defineProperty(fields[key], 'swapFields', {
        value: (indexA, indexB) => swapArrayValues(pathToHere + key, indexA, indexB)
      });
    }
    const fieldArray = fields[key];
    stateArray.forEach((fieldState, index) => {
      if (rest && !fieldArray[index]) {
        fieldArray[index] = {};
      }
      const dest = rest ? fieldArray[index] : {};
      const nextPath = `${pathToHere}${key}[${index}]${rest ? '.' : ''}`;
      const nextPrefix = `${prefix}${key}[]${rest ? '.' : ''}`;

      const result = readField(fieldState, rest, nextPath, dest, syncErrors,
        asyncValidate, isReactNative, props, callback, nextPrefix);
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
    const nextPath = pathToHere + key + '.';
    return readField(state[key] || {}, rest, nextPath, fields[key], syncErrors, asyncValidate,
      isReactNative, props, callback, nextPath);
  }
  const name = pathToHere + fieldName;
  const field = fields[fieldName] || {};
  if (field.name !== name) {
    const onChange = createOnChange(name, change, isReactNative);
    const initialFormValue = read(`${name}.initial`, form);
    const initialValue = initialFormValue || read(name, initialValues);
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
    Object.defineProperty(field, '_isField', {value: true});
  }

  const fieldState = (fieldName ? state[fieldName] : state) || {};
  const syncError = read(name, syncErrors);
  const updated = updateField(field, fieldState, name === form._active, syncError);
  if (fieldName || fields[fieldName] !== updated) {
    fields[fieldName] = updated;
  }
  callback(updated);
  return updated;
};

export default readField;
