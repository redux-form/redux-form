import createOnBlur from './events/createOnBlur';
import createOnChange from './events/createOnChange';
import createOnDragStart from './events/createOnDragStart';
import createOnDrop from './events/createOnDrop';
import createOnFocus from './events/createOnFocus';
import silencePromise from './silencePromise';
import read from './read';
import updateField from './updateField';
import isChecked from './isChecked';

function getSuffix(input, closeIndex) {
  let suffix = input.substring(closeIndex + 1);
  if (suffix[0] === '.') {
    suffix = suffix.substring(1);
  }
  return suffix;
}

const getNextKey = path => {
  const dotIndex = path.indexOf('.');
  const openIndex = path.indexOf('[');
  if (openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    return path.substring(0, openIndex);
  }
  return dotIndex > 0 ? path.substring(0, dotIndex) : path;
};

const shouldAsyncValidate = (name, asyncBlurFields) =>
  // remove array indices
  ~asyncBlurFields.indexOf(name.replace(/\[[0-9]+\]/g, '[]'));

const readField = (state, fieldName, pathToHere = '', fields, syncErrors, asyncValidate, isReactNative, props, callback = () => null, prefix = '') => {
  const {asyncBlurFields, autofill, blur, change, focus, form, initialValues, readonly, addArrayValue,
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
    const addMethods = dest => {
      Object.defineProperty(dest, 'addField', {
        value: (value, index) => addArrayValue(pathToHere + key, value, index, subfields)
      });
      Object.defineProperty(dest, 'removeField', {
        value: index => removeArrayValue(pathToHere + key, index)
      });
      Object.defineProperty(dest, 'swapFields', {
        value: (indexA, indexB) => swapArrayValues(pathToHere + key, indexA, indexB)
      });
      return dest;
    };
    if (!fields[key] || fields[key].length !== stateArray.length) {
      fields[key] = fields[key] ? [...fields[key]] : [];
      addMethods(fields[key]);
    }
    const fieldArray = fields[key];
    let changed = false;
    stateArray.forEach((fieldState, index) => {
      if (rest && !fieldArray[index]) {
        fieldArray[index] = {};
        changed = true;
      }
      const dest = rest ? fieldArray[index] : {};
      const nextPath = `${pathToHere}${key}[${index}]${rest ? '.' : ''}`;
      const nextPrefix = `${prefix}${key}[]${rest ? '.' : ''}`;

      const result = readField(fieldState, rest, nextPath, dest, syncErrors,
        asyncValidate, isReactNative, props, callback, nextPrefix);
      if (!rest && fieldArray[index] !== result) {
        // if nothing after [] in field name, assign directly to array
        fieldArray[index] = result;
        changed = true;
      }
    });
    if (fieldArray.length > stateArray.length) {
      // remove extra items that aren't in state array
      fieldArray.splice(stateArray.length, fieldArray.length - stateArray.length);
    }
    return changed ? addMethods([...fieldArray]) : fieldArray;
  }
  if (dotIndex > 0) {
    // subobject field
    const key = fieldName.substring(0, dotIndex);
    const rest = fieldName.substring(dotIndex + 1);
    let subobject = fields[key] || {};
    const nextPath = pathToHere + key + '.';
    const nextKey = getNextKey(rest);
    const nextPrefix = prefix + key + '.';
    const previous = subobject[nextKey];
    const result = readField(state[key] || {}, rest, nextPath, subobject, syncErrors, asyncValidate,
      isReactNative, props, callback, nextPrefix);
    if (result !== previous) {
      subobject = {
        ...subobject,
        [nextKey]: result
      };
    }
    fields[key] = subobject;
    return subobject;
  }
  const name = pathToHere + fieldName;
  const field = fields[fieldName] || {};
  if (field.name !== name) {
    const onChange = createOnChange(name, change, isReactNative);
    const initialFormValue = read(`${name}.initial`, form);
    let initialValue = initialFormValue || read(name, initialValues);
    initialValue = initialValue === undefined ? '' : initialValue;
    field.name = name;
    field.checked = isChecked(initialValue);
    field.value = initialValue;
    field.initialValue = initialValue;
    if (!readonly) {
      field.autofill = value => autofill(name, value);
      field.onBlur = createOnBlur(name, blur, isReactNative,
        shouldAsyncValidate(name, asyncBlurFields) &&
        ((blurName, blurValue) => silencePromise(asyncValidate(blurName, blurValue))));
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

  const defaultFieldState = {
    initial: field.value,
    value: field.value,
  };

  const fieldState = (fieldName ? state[fieldName] : state) || defaultFieldState;
  const syncError = read(name, syncErrors);
  const updated = updateField(field, fieldState, name === form._active, syncError);
  if (fieldName || fields[fieldName] !== updated) {
    fields[fieldName] = updated;
  }
  callback(updated);
  return updated;
};

export default readField;
