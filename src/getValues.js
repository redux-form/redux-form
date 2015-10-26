import set from 'lodash/object/set';

const getValues = (fields, form) => fields.reduce((accumulator, field) => {
  const value = form[field] ? form[field].value : undefined;
  return set(accumulator, field, value);
}, {});

export default getValues;
