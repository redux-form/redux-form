import {makeFieldValue} from './fieldValue';

function extractKey(field) {
  const dotIndex = field.indexOf('.');
  const openIndex = field.indexOf('[');
  const closeIndex = field.indexOf(']');

  if (openIndex > 0 && closeIndex !== openIndex + 1) {
    throw new Error('found [ not followed by ]');
  }

  const isArray = openIndex > 0 && (dotIndex < 0 || openIndex < dotIndex);
  let key;
  let nestedPath;

  if (isArray) {
    key = field.substring(0, openIndex);
    nestedPath = field.substring(closeIndex + 1);

    if (nestedPath[0] === '.') {
      nestedPath = nestedPath.substring(1);
    }
  } else if (dotIndex > 0) {
    key = field.substring(0, dotIndex);
    nestedPath = field.substring(dotIndex + 1);
  } else {
    key = field;
  }

  return { isArray, key, nestedPath };
}

function normalizeField(field, fullFieldPath, state, previousState, values, previousValues, normalizers) {
  if (field.isArray) {
    if (field.nestedPath) {
      const array = state && state[field.key] || [];
      const previousArray = previousState && previousState[field.key] || [];
      const nestedField = extractKey(field.nestedPath);

      return array.map((nestedState, i) => {
        nestedState[nestedField.key] = normalizeField(
          nestedField,
          fullFieldPath,
          nestedState,
          previousArray[i],
          values,
          previousValues,
          normalizers
        );

        return nestedState;
      });
    }

    const normalizer = normalizers[fullFieldPath];

    return normalizer(
      state && state[field.key],
      previousState && previousState[field.key],
      values,
      previousValues
    );
  } else if (field.nestedPath) {
    const nestedState = state && state[field.key] || {};
    const nestedField = extractKey(field.nestedPath);

    nestedState[nestedField.key] = normalizeField(
      nestedField,
      fullFieldPath,
      nestedState,
      previousState && previousState[field.key],
      values,
      previousValues,
      normalizers
    );

    return nestedState;
  }

  const finalField = state && state[field.key] || {};
  const normalizer = normalizers[fullFieldPath];

  finalField.value = normalizer(
    finalField.value,
    previousState && previousState[field.key] && previousState[field.key].value,
    values,
    previousValues
  );

  return makeFieldValue(finalField);
}

export default function normalizeFields(normalizers, state, previousState, values, previousValues) {
  const newState = Object.keys(normalizers).reduce((accumulator, field) => {
    const extracted = extractKey(field);

    accumulator[extracted.key] = normalizeField(
      extracted,
      field,
      state,
      previousState,
      values,
      previousValues,
      normalizers
    );

    return accumulator;
  }, {});

  return {
    ...state,
    ...newState
  };
}
